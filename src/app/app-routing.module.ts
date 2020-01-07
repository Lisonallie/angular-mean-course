import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  //        vvv because of this need to adjust link to /auth/login & /auth/signup in frontend header.component.html so it goes to the correct address
  { path: 'auth', loadChildren: () => import('./auth.module').then(m => m.AuthModule) }, // connect this to child
  //{ loadChildren: () => import('./your-module-path/module-name.module').then(m => m.ModuleName)};
  { path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
