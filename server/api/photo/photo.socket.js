/**
 * Broadcast updates to client when the model changes
 */

import {Photo} from './photo.model';

export function register(socket) {
    Photo.schema.post('save', function(doc) {
        onSave(socket, doc);
    });
    Photo.schema.post('remove', function(doc) {
        onRemove(socket, doc);
    });
}

function onSave(socket, doc, cb) {
    socket.emit('photo:save', doc);
}

function onRemove(socket, doc, cb) {
    socket.emit('photo:remove', doc);
}
