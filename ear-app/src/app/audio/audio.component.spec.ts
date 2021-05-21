import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FileHelper, TestAppModule, TestHelper } from '../base/test.app.module';
import { AudioPlayerFactory } from '../utils/audio.player';
import { TestAudioPlayerFactory } from '../utils/audio.player.specs';

import { AudioComponent } from './audio.component';

describe('AudioComponent', () => {
  let component: AudioComponent;
  let fixture: ComponentFixture<AudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioComponent ],
      imports: [TestAppModule],
      providers: [
        { provide: AudioPlayerFactory, useClass: TestAudioPlayerFactory },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioComponent);
    component = fixture.componentInstance;
    component.init();
    component.loadFile(new FileHelper().createFakeFile());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be play controls', async(() => {
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('#playAudioButton')).nativeElement.disabled).toBe(false);
      expect(fixture.debugElement.query(By.css('#stopAudioButton'))).toBeNull();
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#' + component.divId)))).toBe(true);
      expect(component.audioPlayer.isPlaying()).toBe(false);
    });
  }));

  it('should be stop audio button', async(() => {
    fixture.debugElement.query(By.css('#playAudioButton')).nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('#playAudioButton'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#stopAudioButton')).nativeElement.disabled).toBe(false);
      expect(component.audioPlayer.isPlaying()).toBe(true);
    });
  }));

  it('should invoke stop audio button', async(() => {
    fixture.debugElement.query(By.css('#playAudioButton')).nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.audioPlayer.isPlaying()).toBe(true);
      fixture.debugElement.query(By.css('#stopAudioButton')).nativeElement.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.audioPlayer.isPlaying()).toBe(false);
      });
    });
  }));

  it('generates random divId', async(() => {
    expect(component.divId).not.toEqual(component.generateId());
  }));
});
