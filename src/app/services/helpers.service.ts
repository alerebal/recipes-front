import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor() { }

  // Split the paragraphs
  splitter(text: string) {
    const regex = /\n/;
    const arr = text.split(regex);
    return arr.filter(item => item !== '');
  }



}
