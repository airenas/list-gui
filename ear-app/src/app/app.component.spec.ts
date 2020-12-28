import { ResultsComponent } from './results/results.component';
import { UploadComponent } from './upload/upload.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Config } from './config';
import { Component } from '@angular/core';
import { TestHelper } from './base/test.app.module';
import { By } from '@angular/platform-browser';
describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(
          [{ path: 'upload', component: TestComponent }, { path: 'results/olia', component: TestRComponent }]
        )
      ],
      declarations: [
        AppComponent
      ],
      providers: [Config]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
  }));
  it('should create the app', async(() => {
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  }));
  it(`should have navigation to upload`, async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div[routerlink="/upload"]')).toBeTruthy();
  }));

  it(`should have navigation to result`, async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div[routerlink="/results"]')).toBeTruthy();
  }));

  it(`should set service url`, async(() => {
    const comp = fixture.componentInstance;
    comp.serviceURL = 'http://olia:8000';
    comp.doDefaultRoute();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(comp.config.baseServiceUrl).toEqual('http://olia:8000');
    });
  }));

  it(`should default to upload`, async(() => {
    const comp = fixture.componentInstance;
    comp.serviceURL = 'http://olia:8000';
    comp.doDefaultRoute();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#uploadID')))).toBe(true);
    });
  }));

  it(`should navigate to result`, async(() => {
    const comp = fixture.componentInstance;
    comp.serviceURL = 'http://olia:8000';
    comp.transcriptionID = 'olia';
    comp.doDefaultRoute();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#resultsID')))).toBe(true);
    });
  }));
});

@Component({
  selector: 'app-test-comp',
  template: '<p id="uploadID"><p>'
})
class TestComponent {
  constructor() { }
}

@Component({
  selector: 'app-test-res-comp',
  template: '<p id="resultsID"><p>'
})
class TestRComponent {
  constructor() { }
}

