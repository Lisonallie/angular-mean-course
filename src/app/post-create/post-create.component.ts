import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  //private property just means it's only useable in this file
  private mode = 'create';
  private postId: string;
  //if it's pulic like below, can access it from within the template
  post: Post;
  // this says it's going to output an event (postCreated)
                                        //Adding Post here tells what type of data it's going to emit.(will be a Post)
                                        //removed @Output as it won't be needed anymore
                                        //postCreated = new EventEmitter<Post>(); all removed don't need it anymore--replaced by Service

  constructor(public postsService: PostsService, public route: ActivatedRoute) {} //making it public lets you not have to make a bunch of other declarations to let angular know it's there and being used.

  ngOnInit() {
    //find whether we have a postId parameter or not
    this.route.paramMap
    .subscribe((paramMap: ParamMap) => {
      //paramMap object
      //          vv checks if it has it! amazing!
      if (paramMap.has('postId')) {
        this.mode = "edit";
        this.postId = paramMap.get('postId');
        //taking this post and storing it
        this.postsService.getPost(this.postId)
          .subscribe(postData => {
            //                        vv post data coming from database
            this.post = {id: postData._id, title: postData.title, content: postData.content};
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) { //NgForm is a new imported type that the behind the scenes angular uses for forms
    if (form.invalid) {
      return; //don't let the form submit if it isn't filled in
    }
    if (this.mode === 'create') {
      // const post: Post = {title: form.value.title, content: form.value.content}; //FOr Post here you don't need to specify that it's an array.
                                //These new declarations instead of giving the inputs their own functions, access the form directly through the ngModel names
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }
                              // this.postCreated.emit(post);  important to bind post as argument to it so it will output the title and content.
    form.resetForm(); //resets the form values after it's been submitted
  }

}
