'use strict';

var _ = require('lodash'),
    Q = require('q'),
    path = require('path'),
    Photo = require('../photo/photo.model'),
    Project = require('../project/project.model'),
    User = require('../user/user.model'),
    FeaturedSection = require('../featured/featuredSection.model'),
    config = require('../../config/environment'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    gridform = require('gridform'),
    ExifImage = require('exif').ExifImage,
    gm = require('gm'),
    Schema = mongoose.Schema,
    Grid = require('gridfs-stream'),
    gridSchema = new Schema({}, {strict: false}),
    gridModel = mongoose.model("gridModel", gridSchema, "fs.files"),
    gfs,
    conn = mongoose.createConnection(config.mongo.uri);

gridform.mongo = mongoose.mongo;
Grid.mongo = mongoose.mongo;

conn.once('open', function(err) {
    if(err) {
        handleError(err);
    } else {
        gfs = Grid(conn.db);
        gridform.db = conn.db;
    }
});

// Get list of files
exports.index = function(req, res) {
    gridModel.find({}, function(err, gridfiles) {
        if(err) handleError(res, err);
        else res.json(gridfiles);
    });
};

// Get a single file
exports.show = function(req, res) {
    if(req.params.id.substring(24) === '.jpg') {
        req.params.id = req.params.id.substring(0, 24);
    }
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    gfs.exist({_id: req.params.id}, function(err, found) {
        if(err) return handleError(err);
        else if(!found) return res.status(404).end();
        else {
            res.header('Content-Type', 'image/jpeg');
            gfs.createReadStream({ _id: req.params.id })
                .on('error', function (err){
                    return handleError(res, err)
                })
                .pipe(res);
        }
    });
};

//
exports.showSize = function(req, res) {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    gfs.exist({_id: req.params.id}, function(err, found) {
        if(err) return handleError(err);
        else if(!found) return res.status(404).end();
        else {
            var readStream = gfs.createReadStream({_id: req.params.id});
            readStream.on('error', handleGridStreamErr(res));
            var sqThumb = gm(readStream, req.params.id);
            sqThumb.size(function(err, size) {
                if(err) return res.status(500).end();
                else {
                    res.status(200).json(size);
                }
            });
        }
    });
};

// Creates a new file in the DB.
exports.create = function(req, res) {
    var form = gridform({db: conn.db, mongo: mongoose.mongo});

    // optionally store per-file metadata
    form.on('fileBegin', function(name, file) {
        file.metadata = {};
    });

    form.parse(req, function(err, fields, files) {
        if(err) return handleError(res, err);

        /**
         * file.name            - the uploaded file name
         * file.type            - file type per [mime](https://github.com/bentomas/node-mime)
         * file.size            - uploaded file size (file length in GridFS) named "size" for compatibility
         * file.path            - same as file.name. included for compatibility
         * file.lastModified    - included for compatibility
         * file.root            - the root of the files collection used in MongoDB ('fs' here means the full collection in mongo is named 'fs.files')
         * file.id              - the ObjectId for this file
         * @type {file}
         */
        var file = files.file;

        if(_.isNull(file) || _.isUndefined(file))
            return res.status(400).send(new Error('No file'));

        console.log(file.name+' -> '+file.id);
        //console.log(fields);

        if(!_.isEmpty(fields)) {
            if(fields.name && typeof fields.name === 'string') {
                file.name = fields.name;
            }
            if(fields.purpose && typeof fields.purpose === 'string') {
                file.purpose = fields.purpose;

                if(fields.purpose.toLowerCase() === 'photo') {
                    var photoModel = {
                        name: file.name,
                        fileId: file.id
                    };
                    if(fields.info && typeof fields.purpose === 'string')
                        photoModel.info = fields.info;

                    getExif(file)
                        .then(function(exifData) {
                            //photoModel.metadata = {exif: exifData.exif, image: exifData.image, gps: exifData.gps};
                            console.log(exifData);

                            // Thumbnail generation
                            var thumbStream = gfs.createReadStream({_id: file.id});
                            thumbStream.on('error', handleGridStreamErr(res));
                            gm(thumbStream, file.id)
                                .size({bufferStream: true}, function(err, size) {
                                    photoModel.width = size.width;
                                    photoModel.height = size.height;
                                    console.log(size);
                                    this.resize(null, 400);
                                    this.quality(90);
                                    this.stream(function(err, outStream) {
                                        if(err) res.status(500).end();
                                        else {
                                            var writestream = gfs.createWriteStream({filename: file.name});
                                            writestream.on('close', function(thumbFile) {
                                                console.log(file.name+' -> (thumb)'+thumbFile._id);
                                                photoModel.thumbnailId = thumbFile._id;

                                                var sqThumbstream = gfs.createReadStream({_id: file.id});
                                                sqThumbstream.on('error', handleGridStreamErr(res));
                                                gm(sqThumbstream, thumbFile._id)
                                                    .resize(200, 200, "^")
                                                    .crop(200, 200, 0, 0)
                                                    .quality(90)
                                                    .stream(function(err, outStream) {
                                                        if(err) res.status(500).end();
                                                        else {
                                                            var writestream = gfs.createWriteStream({filename: thumbFile.name});
                                                            writestream.on('close', function(sqThumbFile) {
                                                                console.log(file.name+' -> (sqThumb)'+sqThumbFile._id);
                                                                photoModel.sqThumbnailId = sqThumbFile._id;

                                                                Photo.create(photoModel, function(err, photo) {
                                                                    if(err) return handleError(res, err);
                                                                    else return res.status(201).json(photo);
                                                                });
                                                            });
                                                            outStream.pipe(writestream);
                                                        }
                                                    });
                                            });
                                            outStream.pipe(writestream);
                                        }
                                    });
                                });
                        });
                }
            }
        } else {
            return res.status(400).end();
        }
    });
};

// Updates an existing file in the DB.
//exports.update = function(req, res) {
//    if(!isValidObjectId(req.params.id)) {
//        return res.status(400).send('Invalid ID');
//    }
//    if(req.body._id) {
//        delete req.body._id;
//    }
//    Upload.findById(req.params.id, function(err, upload) {
//        if(err) {
//            return handleError(res, err);
//        } else if(!upload) {
//            return res.send(404);
//        } else {
//            var updated = _.merge(upload, req.body);
//            updated.save(function(err) {
//                if(err) {
//                    return handleError(res, err);
//                }
//                return res.json(200, upload);
//            });
//        }
//    });
//};

// Deletes a file from the DB.
exports.destroy = function(req, res) {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    if(!req.params.id)
        res.status(404).send(new ReferenceError('File not found.'));
    else {
        gfs.remove({_id: req.params.id}, function(err) {
            if(err) return handleError(err);
            res.status(200).end();
        });
    }
};

// Finds and cleans orphaned GridFS files
exports.clean = function(req, res) {
    getFileIds()
        .then(function(fileIds) {
            Q.allSettled([getPhotoIds(), getProjectIds(), getUserIds(), getFeaturedSectionIds()])
                .then(function(results) {
                    var usedIds = _.pluck(results, 'value');
                    usedIds = _.union(usedIds[0], usedIds[1], usedIds[2], usedIds[3]);
                    usedIds = _.invoke(usedIds, 'toString');

                    fileIds = _.invoke(fileIds, 'toString');

                    _.forEach(fileIds, function(id) {
                        if(!_.contains(usedIds, id)) {
                            console.log('Delete '+id);
                            gfs.remove({_id: id}, function(err) {
                                if(err) return handleError(err);
                            });
                        }
                    });
                });
        });
};

exports.makeLinks = function(req, res) {
    var photoStream = Photo.find().stream();

    photoStream.on('data', function (doc) {
        //console.log(doc);
        if(!doc.metadata)
            doc.metadata = {};
        if(doc.fileId) {

        }
    }).on('error', function (err) {
        console.log(err);
    }).on('close', function () {
        console.log('done');
    });
};

function handleError(res, err) {
    console.log(err);
    return res.status(500).end();
}

function handleGridStreamErr(res) {
    return function(err) {
        if(/does not exist/.test(err)) {
            // trigger 404
            console.log(err);
            return err;
        }

        // may have written data already
        res.status(500).end();
        console.error(err.stack);
    };
}

function getSize(fileId) {
    var deferred = Q.defer();

    (function next() {
        var stream = gfs.createReadStream({_id: fileId});
        stream.on('error', console.log);
        var img = gm(stream, fileId);
        img.size(function(err, size) {
            if(err) return err;
            else if(_.isUndefined(size)) return 'Error: size undefined';
            else {
                deferred.resolve(size);
            }
        });
    })();

    return deferred.promise;
}

function isValidObjectId(objectId) {
    return new RegExp("^[0-9a-fA-F]{24}$").test(objectId);
}

function getExif(file) {
    var deferred = Q.defer();

    gm(gfs.createReadStream({_id: file.id}).on('error', console.log), file.id)
        .toBuffer('JPG', function(err, buffer) {
            new ExifImage({ image: buffer }, function (error, exifData) {
                if (error)
                    deferred.reject(error);
                else
                    deferred.resolve(exifData);
            });
        });

    return deferred.promise;
}

function getPhotoIds() {
    var deferred = Q.defer();

    Photo.find({}, function(err, photos) {
        if(err) deferred.reject(err);
        else deferred.resolve(_.union( _.pluck(photos, 'fileId'), _.pluck(photos, 'thumbnailId'), _.pluck(photos, 'sqThumbnailId') ));
    });

    return deferred.promise;
}

function getUserIds() {
    var deferred = Q.defer();

    User.find({}, function(err, users) {
        if(err) deferred.reject(err);
        else deferred.resolve(_.union( _.pluck(users, 'imageId'), _.pluck(users, 'smallImageId') ));
    });

    return deferred.promise;
}

function getProjectIds() {
    var deferred = Q.defer();

    Project.find({}, function(err, projects) {
        if(err) deferred.reject(err);
        else deferred.resolve(_.union( _.pluck(projects, 'thumbnailId'), _.pluck(projects, 'coverId') ));
    });

    return deferred.promise;
}

function getFeaturedSectionIds() {
    var deferred = Q.defer();

    FeaturedSection.find({}, function(err, featuredSections) {
        if(err) deferred.reject(err);
        else deferred.resolve(_.pluck(featuredSections, 'fileId'));
    });

    return deferred.promise;
}

function getFileIds() {
    var deferred = Q.defer();

    gridModel.find({}, function(err, gridfiles) {
        if(err) deferred.reject(err);
        else deferred.resolve(_.pluck(gridfiles, '_id'));
    });

    return deferred.promise;
}
