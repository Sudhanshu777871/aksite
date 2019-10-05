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
    activeText = Math.ceil(Math.random() * 4) - 1;
    texts = Array(4).fill(0).map((val, i) => i);
    usedTexts: number[] = [];

    constructor(private readonly socketService: SocketService) {
        console.log(socketService);
        socketService.emit('data', [{}]);
        socketService.emit('data', ['data', {}]);
        socketService.emit('data', ['chungus']);
        this.vendorImages = _.shuffle(vendorImages);

        this.activeText = _.sample(this.texts); // Load first random text
    }

    ngOnInit() {
        let addImage = (img: VendorImage, i: number) => {
            const columnEls = Array.from(this.columnEls.nativeElement.children);

            const min = columnEls.reduce((acc: {min: number, el: HTMLDivElement, i: number}, el: HTMLDivElement, j) => {
                let total = 0;
                for(const subEl of el.children as any) {
                    total+= subEl.children[0].offsetHeight;
                }
                const localMin = Math.min(acc.min, total);
                return localMin < acc.min ? {min: localMin, el, i: j} : acc;
            }, {min: Infinity, el: columnEls[0], i: -1});

            this.cols[min.i].push(img);
        };

        let i = 0;
        let daemon = new MiniDaemon(this, () => {
            addImage(vendorImages[i], i++);
        }, 50, vendorImages.length);
        daemon.start();

        this.usedTexts.push(_.remove(this.texts, _.partial(_.isEqual, this.activeText))[0]);
    }

    changeText() {
        // We've used all the styles; start over, using them all again
        if(this.texts.length === 0) {
            this.texts = this.usedTexts;
            this.usedTexts = [];
        }
        // Get the new text ID
        this.activeText = _.sample(this.texts);
        // Move the new text ID to the usedTexts array, so that it's not used again until we run out of styles
        this.usedTexts.push(_.remove(this.texts, _.partial(_.isEqual, this.activeText))[0]);
    }
}
