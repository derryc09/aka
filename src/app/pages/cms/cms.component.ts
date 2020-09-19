import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.scss']
})
export class CmsComponent implements OnInit {
  companyForm;

  companies2Ref: AngularFireObject<any>;
  company: Observable<any>;
  db: AngularFireDatabase;

  constructor(private formBuilder: FormBuilder) {
    // this.companies2Ref = db.object('companies2');
    // this.company = this.companies2Ref.valueChanges();

    this.companyForm = this.formBuilder.group({
      input_companyName: '',
      input_alias1: '',
      input_alias2: '',
      input_alias3: ''
    })


  }
  onSubmit(companyData) {
    
    this.companies2Ref = this.db.object('companies2');
    this.companies2Ref.set(companyData);
    console.log(companyData);

    // this.db.object('companies2').set(companyData);

  }

  ngOnInit(): void {
  }
  addCompany() {

  }

}
