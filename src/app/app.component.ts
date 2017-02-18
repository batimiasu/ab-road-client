import {Component, OnInit, ViewChild, HostListener} from '@angular/core';
import {HttpService} from "./http.service";
import {DetailComponent} from "./detail.commponent";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // ツアー明細ダイアログの参照取得
  @ViewChild("detailDialog") detailComponent: DetailComponent;

  tourObj; // 選択したツアー情報（1件分）
  selectedData; // 選択したエリアのツアー情報
  bookmarks; // ブックマーク
  isMobile; // PCとモバイルの判定
  MOBILE_SCREEN_WIDTH = "768"; // モバイル判定画面幅
  isCollapsed = false; // エリア選択メニューの開閉
  areas = [
    { code: "BCH", name: "ビーチリゾート", data: null},
    { code: "EUR", name: "ヨーロッパ", data: null},
    { code: "DUS", name: "アメリカ", data: null},
    { code: "BOOKMARK", name: "お気に入り", data: null},
  ];
  viewContainerRef; // modal表示用

  public constructor(private httpService: HttpService) { } // HttpServiceのDI

  // アプリ起動時の処理
  ngOnInit() {
    // クラウドからツアー情報取得
    this.getTour();
    // 保存したブックマークの取得
    this.initBookmarks();
  }

  // エリアメニュー選択時
  onAreaChange(index) {
    let area = this.areas[index];
    // ブックマーク選択時
    if (area.code === 'BOOKMARK') {
      if (Object.keys(this.bookmarks).length === 0) {
        alert("ブックマークが登録されていません");
        return;
      }
      this.selectedData = Object.keys(this.bookmarks).map(key => this.bookmarks[key]);
    } else {
      // エリア名選択時
      console.log(area);
      this.selectedData = area.data.data;
    }
    // スクロール位置をリセット（一部のブラウザはタイマーが必要）
    setTimeout(scroll(0, 0), 1);
  }

  // 保存したブックマーク情報の読み取り
  initBookmarks() {
    let storeData = localStorage.getItem("bookmarks");
    if (storeData) {
      this.bookmarks = JSON.parse(storeData);
    } else {
      this.bookmarks = { };
    }
  }

  // ブックマークボタンのクリック時
  onBookmarkClick(tourID, index) {
    // 登録がない場合はブックマーク情報に追加
    if (!this.isMarked(tourID)) {
      // 登録件数の確認
      if (Object.keys(this.bookmarks).length === 0) {
        return alert("Bookmarkは最大10件です。");
      }
      // 登録
      this.bookmarks[tourID] = this.selectedData[index];
    } else {
      // 登録済みの場合はブックマーク情報から削除
      delete this.bookmarks[tourID];
    }
    // 更新されたブックマーク情報の保存
    localStorage.setItem("bookmarks", JSON.stringify(this.bookmarks));
  }

  // ブックマーク登録済み確認
  isMarked(tourID) {
    return this.bookmarks[tourID];
  }

  // 3エリアのツアー情報を一括受信
  getTour() {
    this.selectedData = null;
    for (let i = 0; i < this.areas.length; i++) {
      let areaCode = this.areas[i].code;
      if (areaCode === "BOOKMARK") { // お気に入りはローカル保存のため受信不要
        continue;
      }
      this.httpService.getTourData(areaCode).subscribe(
        result => this.setTour(result, i), // 通信に成功した場合
        error => alert("通信エラー\n" + error) // 通信に失敗した場合
      );
    }
  }

  // 受信データの取得
  setTour(result, i) {
    // Web APIエラー発生時
    if (result.error) {
      alert("Web APIエラー\n" + result.message);
      return;
    }
    // Web API成功時
    this.areas[i].data = result;
  }

  // ツアー詳細ボタンクリック時
  onDetailClick(index) {
    this.tourObj = this.selectedData[index];
    this.detailComponent.openDialog();
  }

}
