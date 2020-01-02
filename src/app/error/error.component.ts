import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
//                    vv specify special token to identify data being passed around
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) { }

  ngOnInit() {
  }

}
