import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireObject, AngularFireList, AngularFireAction } from '@angular/fire/database';
import { Observable, Subject, Subscription, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';

import _ from 'lodash';

type Item = string;
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  private companiesRef: AngularFireList<any>;
  public model: any;
  public model_previous: any;
  public companies: [String];
  public aliases: [String];
  public invalid_name: Boolean;
  db: AngularFireDatabase;
  result$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  name$: BehaviorSubject<string | null>;

  public cms_loaded: Boolean;
  name_empty: Boolean;
  items;

  constructor(db: AngularFireDatabase) {
    this.cms_loaded = false;
    this.db = db;
    this.companiesRef = db.list('companies');
    this.companiesRef.valueChanges().forEach((item) => {
      this.items = item;
      this.companies = _.map(item, 'name'); //transform data to an array of names
      this.name$ = new BehaviorSubject(null);
      // this.result$ = this.name$.pipe(
      //   switchMap(name =>
      //     db.list('/companies', ref => 
      //       name ? ref.orderByChild('nameLowerCase').equalTo(name.toLowerCase()) : ref
      //     ).snapshotChanges()
      //   )
      // );
    })
  }


  formatter = (state: Item) => state;

  checkNameExists(name): Boolean {
    console.log("check Name exist");
    console.log(name);
    this.name_empty = !!!name
    if (_.find(this.items, { nameLowerCase: name.toLowerCase() })) {
      return true;
    } else {
      return false;
    }
  }

  filter = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter(term => term.length >= 2),
      map(term => term.length < 2 ? []
        : this.companies.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  clearBoolean() {
    this.invalid_name = false
    console.log(this.invalid_name);
  }

  search() {
    if (!this.model) {
      this.invalid_name = true;
      console.log("company does not exist");
    } else if (this.model !== this.model_previous) {
      this.invalid_name = false;
      this.model_previous = this.model;
      this.name$.next(this.model);
      this.result$ = this.name$.pipe(
        switchMap(name =>
          this.db.list('/companies', ref =>
            name ? ref.orderByChild('nameLowerCase').equalTo(name.toLowerCase()) : ref
          ).snapshotChanges()
        )
      );
    }

  }
  showCMS(){
    console.log("hi");
    this.cms_loaded = true;
  }
  closeCMS(){
    this.cms_loaded = false;
  }
}
