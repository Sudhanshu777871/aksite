import {wrapperLodash as _, mixin} from 'lodash-es';
import {
    escape
} from 'lodash-es';
mixin(_, {
    escape
});
import { Converter } from 'showdown';
const converter = new Converter();

import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {switchMap} from 'rxjs/operators';
import {Project, ProjectService} from '../../../components/Project/Project.service';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'project-editor',
    templateUrl: './projectEditor.html',
    styleUrls: ['../../projects/project/project.scss', './projectEditor.scss'],
})
export class ProjectEditorComponent {
    loadingProject = true;
    submitted = false;
    project: Project = {
        _id: '',
        name: '',
        info: '',
        file: null,
        content: '',
        hidden: false,
        coverId: '',
    };
    id: string;
    filename?: string;
    fileToUpload?: File;
    newProject: boolean;

    constructor(private readonly http: HttpClient,
                private readonly route: ActivatedRoute,
                private readonly projectService: ProjectService,
                private readonly router: Router,
                private readonly domSanitizer: DomSanitizer) {}

    async ngOnInit() {
        this.id = await new Promise(resolve => this.route.params.subscribe(params => resolve(params.id)));

        if(!this.id || this.id === 'new') {
            this.project = {
                _id: '',
                name: 'Untitled Project',
                info: undefined,
                file: null,
                content: undefined,
                hidden: false,
                coverId: '',
            };
            this.newProject = true;
        } else {
            await this.projectService.get({id: this.id})
                .then(project => {
                    if(!project) {
                        alert('Project not found');
                    } else {
                        this.project = project;
                        this.filename = this.project.coverId;
                        if(this.project.hidden !== true && this.project.hidden !== false) {
                            this.project.hidden = false;
                        }
                    }
                });
        }

        this.loadingProject = false;
    }

    cancel() {
        // if(this.upload) {
        //     this.upload.abort();
        //     this.submitted = false;
        // }
        this.router.navigate(['/admin/projects']);
    }

    doThing(value) {
        this.project.content = value;
    }

    markedContent() {
        try {
            return converter.makeHtml(this.project.content || '');
        } catch(e) {
            return '<h1 class=\"text-danger\">Parsing Error</h1>';
        }
        // return this.domSanitizer.sanitize(SecurityContext.HTML, converter.makeHtml(this.project.content || ''));
        // try {
        //     return this.$sanitize(converter.makeHtml(this.project.content || ''));
        // } catch(e) {
        //     return `<h1 class="text-danger">Parsing Error</h1>
        //             <span class="break-word">${_.escape(e)}</span>`;
        // }
    }

    onFileSelect($files) {
        //$files: an array of files selected, each file has name, size, and type.
        const file = $files[0];

        if(!file) {
            this.filename = null;
            this.fileToUpload = null;
        } else {
            this.filename = file.name;
            this.fileToUpload = file;
        }
    }

    saveProject() {
        this.submitted = true;

        const options = {
            url: this.newProject ? 'api/projects/' : `api/projects/${this.project._id}`,
            method: this.newProject ? 'POST' : 'PUT',
            fields: {
                name: this.project.name,
                info: this.project.info,
                content: this.project.content,
                hidden: this.project.hidden,
                newImage: false,
            },
            file: undefined,
            headers: {},
        };

        // Uploading image
        if(this.fileToUpload && !(this.filename === this.project.coverId || this.filename === null)) {
            if(!this.newProject) {
                options.fields.newImage = true;
            }

            options.file = this.fileToUpload;
            options.headers = {
                'Content-Type': this.fileToUpload.type
            };
        }

        // this.upload = this.Upload.upload(options);

        // this.upload
        //     .progress(evt => {
        //         this.progress = (100.0 * (evt.loaded / evt.total)).toFixed(1);
        //     })
        //     .then(({data, status}) => {
        //         this.progress = undefined;
        //         console.log(status);
        //         console.log(data);
        //         this.$state.go('admin.projects');
        //     })
        //     .catch(({data, status}) => {
        //         this.progress = undefined;
        //         console.log(status);
        //         console.log(data);
        //     });
        //
        // this.upload
        //     .xhr(xhr => {
        //         this.abort = function() {
        //             xhr.abort();
        //         };
        //     });
    }
}
