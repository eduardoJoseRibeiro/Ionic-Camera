import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController
} from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
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
    private camera: Camera) {
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
    alert('Save Image')
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
        this.myPhoto = img
      })
      .catch(err => {
        console.error(err)
      })
  }
}
