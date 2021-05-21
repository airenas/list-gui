import { AudioComponent } from './../audio/audio.component';
import { Observable } from 'rxjs/Observable';
import { TestAudioPlayerFactory } from './../utils/audio.player.specs';
import { TranscriptionService } from './../service/transcription.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadComponent } from './upload.component';
import { MockActivatedRoute, MockSubscriptionService, MockTestService } from '../base/test.app.module';
import { TestAppModule, FileHelper, TestHelper } from '../base/test.app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { ParamsProviderService } from '../service/params-provider.service';
import { APP_BASE_HREF } from '@angular/common';
import { ResultSubscriptionService } from '../service/result-subscription.service';
import { ActivatedRoute } from '@angular/router';
import { AudioPlayerFactory } from '../utils/audio.player';
import { MicrophoneFactory } from '../utils/microphone';
import { TestMicrophoneFactory } from '../utils/microphone.specs';
import { TestParamsProviderService } from '../service/params-provider.service.spec';
import { NgxFilesizeModule } from 'ngx-filesize';

class TestUtil {
  static configure(providers: any[]) {
    TestBed.configureTestingModule({
      declarations: [UploadComponent],
      imports: [TestAppModule, NgxFilesizeModule, RouterTestingModule.withRoutes([])],
      providers: providers
    }).compileComponents();
  }

  static providers(params: TestParamsProviderService): any[] {
    return [{ provide: ParamsProviderService, useValue: params },
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: TranscriptionService, useClass: MockTestService },
    { provide: ResultSubscriptionService, useClass: MockSubscriptionService },
    { provide: AudioPlayerFactory, useClass: TestAudioPlayerFactory },
    { provide: MicrophoneFactory, useClass: TestMicrophoneFactory },
    { provide: ActivatedRoute, useClass: MockActivatedRoute }];
  }
}

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadComponent, AudioComponent],
      imports: [TestAppModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AudioPlayerFactory, useClass: TestAudioPlayerFactory },
        { provide: MicrophoneFactory, useClass: TestMicrophoneFactory }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have File placeholder', async(() => {
    expect(fixture.debugElement.query(By.css('#fileInput'))
      .nativeElement.getAttribute('placeholder')).toBe('Failas');
  }));

  it('should have El Pastas placeholder', async(() => {
    expect(fixture.debugElement.query(By.css('#emailInput'))
      .nativeElement.getAttribute('placeholder')).toBe('El. paštas');
  }));

  it('should have file data when file selected', async(() => {
    component.fileChange(new FileHelper().createFakeFile());
    fixture.debugElement.query(By.css('#hiddenFileInput')).nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const input = fixture.debugElement.query(By.css('#fileInput'));
      const el = input.nativeElement;
      expect(el.value).toBe('file.wav');
    });
  }));

  it('should have readonly button', async(() => {
    expect(fixture.debugElement.query(By.css('#uploadButton')).nativeElement.disabled).toBe(true);
  }));

  it('should have enabled button on valid Input', async(() => {
    expect(fixture.debugElement.query(By.css('#uploadButton')).nativeElement.disabled).toBe(true);
    component.fileChange(new FileHelper().createFakeFile());
    component.email = 'olia';
    fixture.debugElement.query(By.css('#hiddenFileInput')).nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('#uploadButton')).nativeElement.disabled).toBe(false);
    });
  }));

  it('should invoke upload on click', async(() => {
    component.fileChange(new FileHelper().createFakeFile());
    component.email = 'olia';
    fixture.debugElement.query(By.css('#hiddenFileInput')).nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      spyOn(component, 'upload');
      fixture.debugElement.query(By.css('#uploadButton')).nativeElement.click();
      expect(component.upload).toHaveBeenCalled();
    });
  }));

  it('should add audio', async(() => {
    component.fileChange(new FileHelper().createFakeFile());
    expect(component.selectedFileName).toEqual('file.wav');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('app-audio'))).toBeTruthy();
    });
  }));

  it('should add several audio', async(() => {
    const fh = new FileHelper();
    component.filesChange([fh.createFakeFile(), fh.createFakeFile()]);
    expect(component.selectedFileName).toEqual('file.wav, file.wav');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.queryAll(By.css('app-audio')).length).toEqual(2);
    });
  }));

  it('should limit files', async(() => {
    const files: File[] = [];
    const fh = new FileHelper();
    for (let i = 0; i <= 15; i++) {
      files.push(fh.createFakeFile());
    }
    component.filesChange(files);
    expect(component.files.length).toEqual(10);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.queryAll(By.css('app-audio')).length).toEqual(10);
    });
  }));

  it('should be no audio', async(() => {
    component.fileChange(null);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('app-audio'))).toBeNull();
    });
  }));

  it('should be record controls', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('#startRecordButton')).nativeElement.disabled).toBe(false);
      expect(fixture.debugElement.query(By.css('#stopRecordButton'))).toBeNull();
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#micWaveDiv')))).toBe(false);
      expect(component.audioPlayer.isPlaying()).toBe(false);
    });
  }));

  it('should invoke record event', async(() => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('#startRecordButton')).nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('#startRecordButton'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#stopRecordButton')).nativeElement.disabled).toBe(false);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#micWaveDiv')))).toBe(true);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#audioWaveDiv')))).toBe(false);
    });
  }));

  it('should disable uploadButton on recording', async(() => {
    component.fileChange(new FileHelper().createFakeFile());
    component.email = 'olia';
    fixture.debugElement.query(By.css('#startRecordButton')).nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('#uploadButton')).nativeElement.disabled).toBe(true);
    });
  }));

  it('should navigate to Įrašas tab', async(() => {
    component.inputIndexInt = 2;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.debugElement.query(By.css('#aIrasas')).nativeElement.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.inputIndexInt).toBe(0);
      });
    });
  }));

  it('should show Tel Įrašas tab', async(() => {
    component.inputIndexInt = 1;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#fileInputPhone')))).toBeTruthy();
    });
  }));

  it('should show Video tab', async(() => {
    component.inputIndexInt = 2;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#fileInputVideo')))).toEqual(true);
    });
  }));

  it('should show Zoom tab', async(() => {
    component.inputIndexInt = component.ZoomType;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#fileInputZoom')))).toBeTruthy();
    });
  }));

  it('should show Įrašas tab', async(() => {
    component.inputIndexInt = 0;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#fileInput')))).toBeTruthy();
    });
  }));

  it('should show drop Audio', async(() => {
    component.inputIndexInt = 0;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#dndDivAudio')))).toBeTruthy();
      component.dropFile([new FileHelper().createFakeFile()], ['.wav'], false);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(TestHelper.Visible(fixture.debugElement.query(By.css('#dndDivAudio')))).toBeFalsy();
        expect(component.files?.length).toEqual(1);
      });
    });
  }));

  it('should hide drop Audio on recording', async(() => {
    component.inputIndexInt = 0;
    component.recorder.start();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#dndDivAudio')))).toBeFalsy();
    });
  }));

  it('should clear file on wrong file drop', async(() => {
    component.inputIndexInt = 0;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#dndDivAudio')))).toBeTruthy();
      component.dropFile([new FileHelper().createFakeFile()], ['.txt'], false);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(TestHelper.Visible(fixture.debugElement.query(By.css('#dndDivAudio')))).toBeTruthy();
        expect(component.files?.length).toEqual(0);
      });
    });
  }));

  it('should show drop Low Audio', async(() => {
    component.inputIndexInt = 1;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#dndDivPhone')))).toBeTruthy();
      component.dropFile([new FileHelper().createFakeFile()], ['.wav'], false);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(TestHelper.Visible(fixture.debugElement.query(By.css('#dndDivPhone')))).toBeFalsy();
        expect(component.files?.length).toEqual(1);
      });
    });
  }));

  it('should show drop Video', async(() => {
    component.inputIndexInt = 2;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#dndDivVideo')))).toBeTruthy();
      component.dropFile([new FileHelper().createFakeFile()], ['.wav'], false);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(TestHelper.Visible(fixture.debugElement.query(By.css('#dndDivVideo')))).toBeFalsy();
        expect(component.files?.length).toEqual(1);
      });
    });
  }));

  it('should show drop Zoom', async(() => {
    component.inputIndexInt = 3;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#dndDivZoom')))).toBeTruthy();
      component.dropFile([new FileHelper().createFakeFile()], ['.wav'], false);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(TestHelper.Visible(fixture.debugElement.query(By.css('#dndDivZoom')))).toBeFalsy();
        expect(component.files?.length).toEqual(1);
      });
    });
  }));

  it('should drop several Zoom', async(() => {
    component.inputIndexInt = 3;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const f = new FileHelper().createFakeFile();
      component.dropFile([f, f, f], ['.wav'], true);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.files?.length).toEqual(3);
      });
    });
  }));

  it('should hide uploadButton on sending', async(() => {
    component.fileChange(new FileHelper().createFakeFile());
    component.sending = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('#uploadButton'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#uploadSpinner'))).toBeDefined();
    });
  }));

  it('should return correct recognizer', async(() => {
    expect(component.recognizer(0)).toBe('audioDefault');
    expect(component.recognizer(1)).toBe('audioPhone');
    expect(component.recognizer(2)).toBe('audioDefault');
    expect(component.recognizer(component.ZoomType)).toBe('audioDefault');
  }));

  it('should show no spinner', async(() => {
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('#uploadSpinner'))).toBeNull();
    });
  }));

  it('should invoke select file on input click', async(() => {
    spyOn(component, 'openInput');
    fixture.debugElement.query(By.css('#fileInput')).nativeElement.click();
    expect(component.openInput).toHaveBeenCalled();
  }));

  it('should invoke select file on button click', async(() => {
    spyOn(component, 'openInput');
    fixture.debugElement.query(By.css('#selectFileButton')).nativeElement.click();
    expect(component.openInput).toHaveBeenCalled();
  }));

  it('should have set speakerCount values', async(() => {
    component = fixture.debugElement.componentInstance;
    fixture.whenStable().then(() => {
      expect(component.speakerCountValues.length).toBe(3);
    });
  }));
  it('should have set speakerCount value', async(() => {
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('#speakerCountSelect')).nativeElement;
    select.click();
    fixture.detectChanges();
    const matOption = fixture.debugElement.query(By.css('#speakerCountOption-1')).nativeElement;
    matOption.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.speakerCount).toBe('1');
    });
  }));
});

describe('UploadComponent Own Mock', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  it('should read File value from provider', async(() => {
    const params = new TestParamsProviderService();
    params.lastSelectedFile = new FileHelper().createFakeFile();
    TestUtil.configure(TestUtil.providers(params));
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      (async () => {
        // Do something before delay
        console.log('before delay');
        await new Promise(resolve => setTimeout(resolve, 100));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          const input = fixture.debugElement.query(By.css('#fileInput'));
          const el = input.nativeElement;
          expect(el.value).toBe('file.wav');
        });
      })();
    });
  }));

  it('should read email value from provider', async(() => {
    const params = new TestParamsProviderService();
    params.setEmail('olia');
    TestUtil.configure(TestUtil.providers(params));
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const input = fixture.debugElement.query(By.css('#emailInput'));
      const el = input.nativeElement;
      expect(el.value).toBe('olia');
    });
  }));

  it('should read inputType value from provider', async(() => {
    const params = new TestParamsProviderService();
    params.setInputMethod(1);
    TestUtil.configure(TestUtil.providers(params));
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.inputIndexInt).toBe(1);
    });
  }));

  it('should read speakerCount  value from provider', async(() => {
    const params = new TestParamsProviderService();
    params.setSpeakerCount('2');
    TestUtil.configure(TestUtil.providers(params));
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.speakerCount).toBe('2');
    });
  }));

  it('should set default speakerCount value', async(() => {
    const params = new TestParamsProviderService();
    params.setSpeakerCount(null);
    TestUtil.configure(TestUtil.providers(params));
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.speakerCount).toBe('-');
    });
  }));

  it('should stop recording on destroy', async(() => {
    const params = new TestParamsProviderService();
    TestUtil.configure(TestUtil.providers(params));
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.recorder.start();
      expect(component.recorder.recording).toEqual(true);
      fixture.destroy();
      fixture.whenStable().then(() => {
        expect(component.recorder.recording).toEqual(false);
      });
    });
  }));

  it('should default to non skipNumJoin', async(() => {
    const params = new TestParamsProviderService();
    TestUtil.configure(TestUtil.providers(params));
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.recorder.start();
      expect(component._uploadParamSkipNumJoin).toEqual(false);
    });
  }));

  it('should read skipNumJoin param', async(() => {
    const params = new TestParamsProviderService();
    const prv = TestUtil.providers(params);
    prv.push({
      provide: ActivatedRoute, useValue: {
        snapshot: {
          queryParamMap:
            new Map([['skipNumJoin', '1']])
        }
      }
    });
    TestUtil.configure(prv);
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.recorder.start();
      expect(component._uploadParamSkipNumJoin).toEqual(true);
    });
  }));
});
