import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Angular 6';
  url = 'https://docs.google.com/forms/d/e/1FAIpQLSdqBLC3ZJ8sNRb0xx2Byp7VVFaaz53f3zwGFaKS0p3leDpfsw/formResponse';

  interestOptions = [
    { id: 1, label: '看AMOS直播', value: 'AMOS', selected: false },
    { id: 2, label: '看AMOS推坑', value: 'PUSH MAN AMOS', selected: false },
    { id: 3, label: '看AMOS炙燒牛排', value: 'FIRE MAN AMOS', selected: false },
    { id: 4, label: '看ALEX直播', value: 'ALEX', selected: false },
    { id: 5, label: '看TOMMY直播', value: 'TOMMY', selected: false },
    { id: 6, label: '看甲級工具人直播', value: 'franmo', selected: false },
  ];

  fieldMapping = {
    name: 'entry.939695647',
    gender: 'entry.1798110377',
    email: 'entry.1117032030',
    interest: 'entry.342875127',
    birthday: 'entry.1091494304',
    birthdayTime: 'entry.220326002',
    jump: 'entry.1922085348',
    memo: 'entry.2141791396'
  };

  formData = this.fb.group({
    name: ['', Validators.required],
    gender: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    interest: this.fb.array(this.buildinterest(), this.interestRequired()),
    birthday: '',
    birthdayTime: '',
    jump: ['', Validators.required],
    memo: ''
  });

  get interest() {
    return this.formData.get('interest') as FormArray;
  }

  interestRequired() {
    return control => control.value.some((item) => item) ? null : { 'interest rquired': { valid: false } }
  }

  buildinterest() {
    return this.interestOptions.map(skill => {
      return this.fb.control(skill.selected);
    });
  }

  save() {
    if (this.formData.valid) {
      const rawValue = this.formData.getRawValue();      
      let body = new HttpParams();
      Object.entries(rawValue).forEach(([key, value]) => {
        if (key === 'interest') {
          value.forEach((v, idx) => {
            if (v) {
              body = body.append(this.fieldMapping[key], this.interestOptions[idx].label);
            }
          })
        } else {
          body = body.append(this.fieldMapping[key], value);
        }
      })
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      };
      this.http.post(this.url, body, httpOptions).subscribe(() => { }, (err) => { });
    } else {
      console.log('form is invalid');
    }
  }

  constructor(private fb: FormBuilder, private http: HttpClient) { }
}
