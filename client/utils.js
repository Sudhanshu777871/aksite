import { Response } from '@angular/http';

export function extractData(res: Response) {
    if(!res.text()) return {};
    return res.json() || {};
}
