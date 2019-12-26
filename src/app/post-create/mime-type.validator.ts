import { AbstractControl } from '@angular/forms';
//                              vv of is a quick & easy way of creating an observable which will emit data immediately
import { Observable, Observer, of } from 'rxjs';

//because it's an asynchronous validator, have to vvvv define special return type: either a promise or an observable
//if a validator return null, it is valid. null is valid
//                                                             vv saying this'll have a property of type string, no specific property name-- dynamic (of type any)
//                                                         v both values (promise & observable) are generic so we can clarify what type of data we want to see:
export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
    if (typeof(control.value) === 'string') {
        // simply returns that this is valid
        return of(null);
    }
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
            //                                                              vvv this is the part which allows us to get the mime type
            const array = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
            let header = "";
            let isValid = false;
            // to get the file type we're working with, we need to read a certain pattern; done with a for loop
            for (let i = 0; i < array.length; i++) {
                //                         vv pass 16 as argument to convert this result to a hexidecimal string
                header += array[i].toString(16);
            }
            //building strings of hexidecimals with clearly defined patters for each file type
            switch (header) {
                //these patterns stand for certain file types
                case "89504e47":
                    isValid = true;
                    break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                    isValid = true;
                    break;
                default:
                    isValid = false;
                    break;
            }
            //now need to use observable to emit data
            if (isValid) {
                //have to emit null if it's valid
                observer.next(null);
            } else {
                //if not valid, emit different value: error code
                observer.next({ invalidMimeType: true })
            }
            //let subscribers know we're done
            observer.complete();
        });
        //start process, allows us to access the mime type
        fileReader.readAsArrayBuffer(file);
    });
    //return the observable we created
    return frObs;
};