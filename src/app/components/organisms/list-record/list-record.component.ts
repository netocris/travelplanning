import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { BaseComponent } from '../../base.component';
import { ConfigService } from '../../../services/config.service';
import { RecordService } from '../../../services/record.service';
import { IRecord } from '../../../models/i-record';
import { Record } from '../../../models/record';
import { IBlock } from '../../../models/i-block';
import { Block } from '../../../models/block';
import { IBlockContent } from '../../../models/i-block-content';
import { BlockContent } from '../../../models/block-content';
import { PaginationEnum } from '../../../enum/pagination.enum';

@Component({
  selector: 'app-list-record',
  templateUrl: './list-record.component.html',
  styleUrls: ['./list-record.component.css']
})
export class ListRecordComponent extends BaseComponent {

  private subscription: Subscription = null;

  records: IRecord[] = [];

  page: number = 1;

  pageSize: number = 10;

  closeResult: string;

  constructor(private router: Router, private configService: ConfigService, private recordService: RecordService, private modalService: NgbModal) {
    super();
  }

  protected ngOnInitCustom(): void {
    this.page = Number(this.getConfigValue(PaginationEnum.PAGE));
    this.pageSize = Number(this.getConfigValue(PaginationEnum.PAGE_SIZE));
    if (this.isEmptyObject(this.subscription)) {
      this.stillLoading = true;
      this.subscription = this.recordService.getRecordsSnap().subscribe((data: any) => {
        this.records = [];
        if (data) {
          this.processData(data);
        }
        this.stillLoading = false;
      });
    }
  }

  protected ngOnDestroyCustom(): void {
    if (!this.isEmptyObject(this.subscription)) {
      this.subscription.unsubscribe();
    }
  }

/**
   * preview record
   *
   * @param id record id
   */
  preview(id: string){
    this.open("modalContent");
  }

  /**
   * edit record
   *
   * @param id record id
   */
  edit(id: string){
    this.router.navigate(['/edit', id]);
    // this.router.navigate(['/edit'], {
    //   queryParams: { id: id }
    // });
  }

  /**
   * delete record
   *
   * @param id record id
   */
  delete(id: string){
    this.recordService.delete(id);
  }

  /**
   * page event emitter
   *
   * @param value page number
   */
  pageEventEmitter(value: number): void {
    this.page = value;
  }

  open(content) {
    this.modalService.open(content, { scrollable: true });
  }

  /**
   * process data from service
   *
   * @param data data
   */
  private processData(data: any): void {

    if(!this.isEmptyArray(data)){

      data.filter(dataItem => {

        const doc = dataItem.payload.doc;
        if(!this.isEmptyObject(doc)){

          const record: IRecord = new Record();

          // store record id
          record.id = doc.id;

          // process data object
          const docData = doc.data();
          if(!this.isEmptyObject(docData)){
            record.time = docData.time;
            record.blocks = [];
            docData.blocks.filter(blockItem => {
              const block: IBlock = new Block();
              block.type = blockItem.type;
              const blockContent: IBlockContent = new BlockContent();
              blockContent.text = blockItem.data.text;
              block.data = blockContent;
              record.blocks.push(block);
            });
          }

          this.records.push(record);

        }

      });

    }

  }

  /**
   *
   * @param key
   */
  private getConfigValue(key: string): string {
    return this.configService.getStringKey(key);
  }

}
