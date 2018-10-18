import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  Platform
} from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CameraListPage } from '../camera-list/camera-list';

/**
 * Generated class for the CameraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {

  myPhoto: string; // = '../../assets/imgs/logo.png'

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheet: ActionSheetController,
    private camera: Camera,
    private filePath: FilePath,
    private platform: Platform,
    private sqlite: SQLite
  ) {
  }

  ngOnInit () {
    this.sqlite.create({
      name: 'data.db',
      location: 'default',
    })
      .then((db: SQLiteObject) => {
        return db.executeSql('CREATE TABLE photos(url varchar(250))')
          .then(() => console.log('Tabela Criada'))
          .catch((err) => console.log(err))
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraPage');
  }

  choosePhoto () {
    let actionSheet = this.actionSheet.create({
      title: 'Selecione uma Imagem',
      buttons: [
        {
          text: 'Tirar Foto',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.CAMERA, this.camera.MediaType.PICTURE)
          }
        },
        {
          text: 'Selecione uma Foto',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY, this.camera.MediaType.PICTURE)
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    })

    actionSheet.present()
  }

  saveImage () {
    this.sqlite.create({
      name: 'data.bd',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        return db.executeSql(`INSERT INTO photos (url) VALUES (${this.myPhoto})`)
      })
      .then(() => this.navCtrl.push(CameraListPage))
      .catch(err => console.log(err))
  }

  private takePhoto (sourceType: number = 1, mediaType: number = 0) {
    const options: CameraOptions = {
      quality: 100,
      mediaType,
      sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG
    }

    this.camera.getPicture(options)
      .then(img => {
        if (sourceType === 0 && this.platform.is('android')) {
          this.filePath.resolveNativePath(img)
            .then((filePath) => {
              this.myPhoto = filePath
            })
            .catch(err => {
              console.error(err)
            })
        } else {
          this.myPhoto = img
        }
      })
      .catch(err => {
        console.error(err)
      })
  }
}
