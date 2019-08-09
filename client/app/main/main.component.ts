import {
    wrapperLodash as _,
    sample,
    mixin,
    shuffle,
    remove,
    forEach,
    partial,
    isEqual,
    noop,
    throttle,
} from 'lodash-es';
mixin(_, {
    sample,
    shuffle,
    remove,
    forEach,
    partial,
    isEqual,
    noop,
    throttle,
});

import { Component, OnInit } from '@angular/core';
import {ViewChild} from '@angular/core'
import {
    trigger,
    state,
    style,
    animate,
    transition,
} from '@angular/animations';

import { SocketService } from '../../components/socket/socket.service';

import MiniDaemon from '../../components/minidaemon';
import classie from 'classie';

let texts = ['dashed-stroke-text', 'gradient-text', 'pattern-text', /*'diag-striped-text',*/ 'bg-img-text'];
let usedTexts = [];
let currentText = _.sample(texts); // Load first random text
let vendorImages: VendorImage[] = [{
    href: 'https://angular.io/',
    src: 'assets/images/angular.svg',
    alt: 'angular'
}, {
    href: 'http://d3js.org/',
    src: 'assets/images/d3.svg',
    alt: 'd3'
}, {
    href: 'https://karma-runner.github.io',
    src: 'assets/images/karma.png',
    alt: 'karma'
}, {
    href: 'https://lodash.com/',
    src: 'assets/images/lodash.svg',
    alt: 'lodash'
}, {
    href: 'https://webpack.github.io',
    src: 'assets/images/webpack.png',
    alt: 'webpack'
}, {
    href: 'http://mochajs.org/',
    src: 'assets/images/mocha.svg',
    alt: 'mocha'
}, {
    href: 'http://sass-lang.com/',
    src: 'assets/images/sass.svg',
    alt: 'sass'
}, {
    href: 'https://babeljs.io/',
    src: 'assets/images/babel.png',
    alt: 'babel'
}, {
    href: 'https://www.mongodb.org/',
    src: 'assets/images/mongodb.svg',
    alt: 'mongodb'
}, {
    href: 'https://nodejs.org/',
    src: 'assets/images/nodejs.svg',
    alt: 'nodejs'
}, {
    href: 'http://expressjs.com/',
    src: 'assets/images/express.png',
    alt: 'express'
}, {
    href: 'https://www.npmjs.com/',
    src: 'assets/images/npm.svg',
    alt: 'npm'
}, {
    href: 'http://github.com/',
    src: 'assets/images/github.png',
    alt: 'github'
}, {
    href: 'https://www.docker.com/',
    src: 'assets/images/docker.svg',
    alt: 'docker'
}, {
    href: 'http://kubernetes.io/',
    src: 'assets/images/kubernetes.svg',
    alt: 'kubernetes'
}, {
    href: 'https://cloud.google.com/',
    src: 'assets/images/gcp.svg',
    alt: 'gcp'
}, {
    href: 'https://circleci.com/',
    src: 'assets/images/circleci.svg',
    alt: 'circleci'
}, {
    href: 'https://www.jetbrains.com/webstorm/',
    src: 'assets/images/webstorm.svg',
    alt: 'WebStorm'
}];

interface VendorImage {
    href: string;
    src: string;
    alt?: string;
}

@Component({
    selector: 'main',
    templateUrl: './main.html',
    styleUrls: ['./main.scss'],
    animations: []
})
export class MainComponent implements OnInit {
    vendorImages: VendorImage[];
    cols: VendorImage[][] = [[], [], []];
    @ViewChild('columns', {static: false}) columnEls;

    constructor(private readonly socketService: SocketService) {
        console.log(socketService);
        socketService.emit([{}]);
        socketService.emit(['data', {}]);
        socketService.emit(['chungus']);
        this.vendorImages = _.shuffle(vendorImages);
    }

    ngOnInit() {
        let addImage = (img: VendorImage, i: number) => {
            const columnEls = Array.from(this.columnEls.nativeElement.children);

            const min = columnEls.reduce((acc: {min: number, el: HTMLUListElement, i: number}, el: HTMLUListElement, j) => {
                const localMin = Math.min(acc.min, (el.children[0] as HTMLDivElement).offsetHeight);
                return localMin < acc.min ? {min: localMin, el, i: j} : acc;
            }, {min: Infinity, el: columnEls[0], i: -1});

            this.cols[min.i].push(img);
        };

        let i = 0;
        let daemon = new MiniDaemon(this, () => {
            addImage(vendorImages[i], i++);
        }, 50, vendorImages.length);
        daemon.start();

        classie.removeClass(document.getElementById(currentText), 'hidden');
        usedTexts.push(_.remove(texts, _.partial(_.isEqual, currentText)));
    }

    changeText() {
        // We've used all the styles; start over, using them all again
        if(texts.length === 0) {
            texts = usedTexts;
            usedTexts = [];
        }
        // Hide the previously used text
        classie.addClass(document.getElementById(currentText), 'hidden');
        // Get the new text ID
        currentText = _.sample(texts);
        // Move the new text ID to the usedTexts array, so that it's not used again until we run out of styles
        usedTexts.push(_.remove(texts, _.partial(_.isEqual, currentText)));
        // Show the new text
        classie.removeClass(document.getElementById(currentText), 'hidden');
    }
}
