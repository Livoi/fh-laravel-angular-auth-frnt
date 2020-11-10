import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../services/auth-guard.service';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [ AuthGuardService ]
  }
];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class HomeModule { }
