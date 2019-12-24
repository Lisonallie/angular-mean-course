import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'; //removed NgForm from import
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
  isLoading = false;
  form: FormGroup;
  // this says it's going to output an event (postCreated)
                                        //Adding Post here tells what type of data it's going to emit.(will be a Post)
                                        //removed @Output as it won't be needed anymore
                                        //postCreated = new EventEmitter<Post>(); all removed don't need it anymore--replaced by Service

  constructor(public postsService: PostsService, public route: ActivatedRoute) {} //making it public lets you not have to make a bunch of other declarations to let angular know it's there and being used.

  ngOnInit() {
    this.form = new FormGroup({
      //good practice to wrap in single quotations
      //                       vv 1st argument is the beginning form (default) state: null for empty 
      //                              vv 2nd allows us to attach validators or general form control options/ js object w/ synchronous & asynchronous validators
      //                                          vv can set 2nd argument here called blur which only checks validation upon un-focusing of element
      //                                                            vv no execution required, (), angular executes it for you
      //                                                                                    vv need to execute this to configure the length
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'content': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null)
    });
    //find whether we have a postId parameter or not
    this.route.paramMap
    .subscribe((paramMap: ParamMap) => {
      //paramMap object
      //          vv checks if it has it! amazing!
      if (paramMap.has('postId')) {
        this.mode = "edit";
        this.postId = paramMap.get('postId');
        //show spinner when start fetching
        this.isLoading = true;
        //taking this post and storing it
        this.postsService.getPost(this.postId)
          .subscribe(postData => {
            //hide spinner when done fetching
            this.isLoading = false;
            //                        vv post data coming from database
            this.post = {id: postData._id, title: postData.title, content: postData.content};
            //override values for form control that were previously registerd(null)
            this.form.setValue({
              'title': this.post.title, 
            'content': this.post.content
          });
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImageChosen(event: Event) { //Event is a default type you dont have to import
    const file = (event.target as HTMLInputElement).files[0] //as ... does a typescript conversion and clearly tells TS that the file is that sort of type w/ files property
    //        vv allows you to target a single formcontrol
    this.form.patchValue({image: file});
    // informs angular that I changed the value and it should reevaluate and store that value internally and check whether the value that's been patched is valid
    this.form.get('image').updateValueAndValidity();
    console.log(file, this.form);
  }

  //onSavePost(form: NgForm) no longer valid because we no longer pass the form as an argument---we have our own form object^^^
  onSavePost() { //NgForm is a new imported type that the behind the scenes angular uses for forms
    if (this.form.invalid) { // <--- add 'this' before form.invalid (reactive form)
      return; //don't let the form submit if it isn't filled in
    }
    // vvv don't need to reset as false because we navigate away from this page anyways
    this.isLoading = true;
    if (this.mode === 'create') {
      // const post: Post = {title: form.value.title, content: form.value.content}; //FOr Post here you don't need to specify that it's an array.
                                //These new declarations instead of giving the inputs their own functions, access the form directly through the ngModel names
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    }
                              // this.postCreated.emit(post);  important to bind post as argument to it so it will output the title and content.
    this.form.reset(); //resets the form values after it's been submitted
    //form.resetForm() for template-driven form
  }

}
