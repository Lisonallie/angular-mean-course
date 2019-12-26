import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

//because it's an asynchronous validator, have to vvvv define special return type: either a promise or an observable
//if a validator return null, it is valid. null is valid
//                                                             vv saying this'll have a property of type string, no specific property name-- dynamic (of type any)
//                                                         v both values (promise & observable) are generic so we can clarify what type of data we want to see:
export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
    const file = control.value as File;
    const fileReader = new FileReader();
    //we need onloadend not onload
    //create our own observable because that's what needs to be returned by function:
    //frObs = file reader observable
    //                                          vv Observer is a generic type
    const frObs = Observable.create((observer: Observer<{ [key: string]: any }>) => {
        fileReader.addEventListener("loadend", () => {
            //emit new value with information if the file is valid or not
            //                vvv creates new array of 8-bit unside integers, allows us to read certain patterns that we can use to parse the mime type
            const array = new Uint8Array
        });
        //start process, allows us to access the mime type
        fileReader.readAsArrayBuffer(file);
    });
};