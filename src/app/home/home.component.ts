import { Component, Input, OnInit } from '@angular/core';
import { JwtHelperService } from '../services/jwt-helper.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { GrantApiService } from '../services/grant-api.service';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { Grant } from '../services/model/grant';
import { JsonPipe } from '@angular/common';

interface StatusOption {
  value: string;
  viewValue: string;
}

interface CurrencyOption {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {

  // Variables
  grantList: Grant[];
  accessToken: any;
  accessTokenDetails: any;
  loading: boolean;
  grantMessage: string;
  formCreate: FormGroup;
  errors: boolean;
  index: any;
  action='Create';
  datasComMovimentacoes: any;
  statusoptions: StatusOption[] = [
    {value: 'In Consideration', viewValue: 'In Consideration'},
    {value: 'Development', viewValue: 'Development'},
    {value: 'Submitted', viewValue: 'Submitted'},
    {value: 'Did Not Submit', viewValue: 'Did Not Submit'},
    {value: 'Implementation', viewValue: 'Implementation'},
    {value: 'Not Awardedt', viewValue: 'Not Awarded'},
    {value: 'Closeout', viewValue: 'Closeout'},
    {value: 'Closed', viewValue: 'Closed'}
  ];  

  currencyoptions: CurrencyOption[] = [
    {value: 'USD', viewValue: 'USD'}
  ];
  selectedStatusOption: any;
  selectedCurrencyOption= this.currencyoptions[1];

  constructor(
    fb: FormBuilder,
    jwtHelper: JwtHelperService,
    private authService: AuthService,
    public grantApiService: GrantApiService,
    private router: Router
  ) {
    
    this.formCreate = fb.group({
      id:[''],
      statusControl:['', Validators.required ],
      grant_name: ['',Validators.required],
      //grant_status: ['',Validators.required],
      grantor: ['',Validators.required],
      grant_geo_location: ['',Validators.required],
      grant_description: ['',Validators.required],
      grant_amount: ['', [Validators.required,Validators.pattern("^[0-9]{1,10}$")]],
      //grant_amount_currency: ['',Validators.required]
      statusCurrency:['', Validators.required ]
    });
    //const toSelect = this.statusoptions.find(c => c.value == this.local_data.InvestmentType );
    //this.form.get('exampleFormControlSelect1').setValue(this.statusoptions[1]);
    this.refreshGrantList();

    this.accessToken = localStorage.getItem('access_token');
    this.accessTokenDetails = {
      id: jwtHelper.id(),
      name: jwtHelper.name(),
      email: jwtHelper.email()
    };
  }

  ngOnInit(){ 
    this.resetForm();
    this.refreshGrantList();
   
  }


  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
    }
    this.grantApiService.selectedGrant = {
      id: '',
      grant_name: '',
      grant_status: '',
      grantor: '',
      grant_geo_location: '',
      grant_description: '',
      grant_amount: '',
      grant_amount_currency: '',
      statusCurrency:'',
      statusControl:''
    };

    this.formCreate.controls['statusControl'].setValue('', {onlySelf: true});
    this.formCreate.controls['statusCurrency'].setValue('', {onlySelf: true});
  }


  onSubmit() {
    this.errors = false;
    //alert(JSON.stringify(this.formCreate.value));
    if (this.formCreate.value.id === '') {
      this.grantApiService.saveGrant(this.formCreate.value).subscribe((res) => {
        
        this.resetForm();        
        this.refreshGrantList();
        this.action='Create';
        //this.toastr.success('Successfully Saved!');
      },
      err => {
        //this.toastr.error(err.error);
        console.log(err);
        this.errors = true;
      });
    } else {
  
      this.grantApiService.updateGrant(this.formCreate.value.id, this.formCreate.value).subscribe((res) => {
        this.resetForm();
        this.refreshGrantList();
        this.action='Create';
        //this.toastr.success('Successfully Updated!');
      },
      err => {
        //this.toastr.error('Error!');
        console.log(err);
        this.errors = true;
      });
    }
  }

  

  onEdit(grt: Grant) {
    //console.log("onEdit Start");
    this.action='Edit';
    this.grantApiService.selectedGrant = Object.assign({}, grt);
    this.index = this.statusoptions.findIndex(x => x.value === this.grantApiService.selectedGrant.grant_status);
    this.formCreate.controls['statusControl'].setValue(this.statusoptions[this.index].value, {onlySelf: true});

    this.index = this.currencyoptions.findIndex(x => x.value === this.grantApiService.selectedGrant.grant_amount_currency);
    this.formCreate.controls['statusCurrency'].setValue(this.currencyoptions[this.index].value, {onlySelf: true});
 
  }

  onDelete(id: string) {
    if (confirm('Are you sure to delete this record ?') === true) {
      this.grantApiService.deleteGrant(id).subscribe((res) => {
        this.resetForm();
        this.refreshGrantList();
        //this.toastr.success('Successfully Deleted!');
      },
      err => {
        //this.toastr.error('Error!');
        console.log(err);
      });
    }
  }

  refreshGrantList() {    
    this.grantApiService.getGrantList().subscribe((res) => {
      if (res['grant']) {
        this.grantList = [];
          for (let i in res['grant']) {
            const data: Grant = {              
              id: res['grant'][i]['id'],
              grant_name: res['grant'][i]['grant_name'],
              grant_status: res['grant'][i]['grant_status'],
              grantor: res['grant'][i]['grantor'],
              grant_geo_location: res['grant'][i]['grant_geo_location'],
              grant_description: res['grant'][i]['grant_description'],
              grant_amount: res['grant'][i]['grant_amount'],
              grant_amount_currency: res['grant'][i]['grant_amount_currency'],
              statusCurrency: res['grant'][i]['grant_amount_currency'],
              statusControl: res['grant'][i]['grant_status'],
            };
            this.grantList.push(data);
          }
          this.grantApiService.grants = this.grantList; 
   
      }
      /*if (this.grantApiService.grants.length === 0) {
        this.grantMessage = 'No grants added';
      } else {
        this.grantMessage = '';
      }*/
    },
    err => {
      //this.toastr.error('Error!');
      console.log(err);
    });
  }

  /**
   * Logout the user and revoke his token
   */
  logout(): void {
    this.loading = true;
    this.authService.logout()
      .subscribe(() => {
        this.loading = false;
        localStorage.removeItem('access_token');
        this.router.navigate(['/login']);
      });
  }

}
