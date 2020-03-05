import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { DialogService } from '../providers/dialog.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        ClarityModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        ClarityModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [DialogService],
})
export class SharedModule { }
