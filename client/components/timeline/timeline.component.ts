import {Component} from '@angular/core';

@Component({
    templateUrl: './timeline.html',
    styleUrls: ['./timeline.scss'],
})
export class TimelineComponent {
    openedCard;
    items;

    toggleCardOpen(card) {
        if(this.openedCard === card) {  // Clicked card is the open one, close it
            this.openedCard = null;
            card.open = false;
        } else if(this.openedCard) {     // Another card is open, close it and open this one
            this.openedCard.open = false;
            card.open = true;
            this.openedCard = card;
        } else {                    // No open cards, open this one
            card.open = true;
            this.openedCard = card;
        }
    };
}
