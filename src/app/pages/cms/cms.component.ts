import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList, AngularFireAction } from '@angular/fire/database';
import { Observable, Subject, Subscription, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import _ from 'lodash';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.scss']
})
export class CmsComponent implements OnInit {
  companyForm;

  companiesRef: AngularFireList<any>;
  company: Observable<any>;
  db: AngularFireDatabase;

  companies$: AngularFireList<any>;

  items$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  size$: BehaviorSubject<string | null>;
  names$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  searchInput$: BehaviorSubject<string | null>;
  name_disabled: Boolean;
  name_empty: Boolean;

  // Toast success message
  private _success = new Subject<string>();
  private _failed = new Subject<string>();

  successMessage = '';
  errorMessage = ''
  staticAlertClosed = false;


  items;
  constructor(private formBuilder: FormBuilder, db: AngularFireDatabase) {
    this.name_disabled = false;
    this.name_empty = false;
    this.companiesRef = db.list('companies');
    this.companyForm = this.formBuilder.group({
      input_companyName: '',
      input_alias1: '',
      input_alias2: '',
      input_alias3: ''
    })
    this.companiesRef.valueChanges().forEach((item) => {
      this.items = item;
    })

    this.size$ = new BehaviorSubject(null);
    this.items$ = this.size$.pipe(
      switchMap(size =>
        db.list('/companies', ref =>
          size ? ref.orderByChild('nameLowerCase').equalTo(size.toLowerCase()) : ref
        ).snapshotChanges()
      )
    );
    this.size$.subscribe(queriedItems => {
      console.log('queried items: ' + queriedItems);
    });



  }
  filterBy(size: string | null) {
    this.size$.next(size);
  }

  checkNameValid(name): Boolean {
    console.log("check Name exist");
    console.log(name);
    this.name_empty = !!!name
    if (_.find(this.items, { nameLowerCase: name.toLowerCase() })) {
      this.name_disabled = true;
      return true;
    } else {
      this.name_disabled = false;
      return false;
    }
  }
  async onSubmit(companyData) {
    console.log("on submit");
    if (this.checkNameValid(companyData.input_companyName)) {
      console.log("Name exists");
    } else {
      console.log("Name does not exist");

      var name = companyData.input_companyName;
      var data = {
        name: companyData.input_companyName,
        nameLowerCase: companyData.input_companyName.toLowerCase(),
        alias: []
      }
      companyData.input_alias1 !== '' ? data.alias.push(companyData.input_alias1) : ''
      companyData.input_alias2 !== '' ? data.alias.push(companyData.input_alias2) : ''
      companyData.input_alias3 !== '' ? data.alias.push(companyData.input_alias3) : ''
      console.log(data);
      this.companiesRef.push(data)
        .then(() => {
          this.changeSuccessMessage();
        })
        .catch((err) => {
          console.log(err)
          this.changeErrorMessage();
        });
    }



  }

  changeSuccessMessage() {
    this._success.next('Company successully submitted.');
  }
  changeErrorMessage() {
    this._success.next('Sorry, something went wrong. Your input was not saved.');
  }
  ngOnInit(): void {
    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = '');

    this._failed.subscribe(message => this.errorMessage = message);
    this._failed.pipe(
      debounceTime(5000)
    ).subscribe(() => this.errorMessage = '');
  }
  addCompany() {

  }

}
