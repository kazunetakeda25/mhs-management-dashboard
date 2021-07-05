<template>
  <div class="visits-page">
    <div v-if="role == 'Manager'" class="manager-page">
      <h1 class="page-title">
        Manager&nbsp;
        <small>
          <small>Assembly Department</small>
        </small>
      </h1>
      Greetings, {{ name }}!
      <br />
      <br />
      <b-tabs>
        <b-tab title="Work Orders" active>
          <div class="d-flex justify-content-between">
            <h3><span class="fw-semi-bold">Work Order List</span></h3>
            <b-button
              id="addWorkOrderButton"
              :disabled="addWorkOrderDisabled"
              variant="success"
              size="sm"
              v-on:click="showAddWorkOrderModal()"
              >Add New</b-button
            >
          </div>
          <div class="clearfix pt-2 pb-2">
            <p>Display All Available Work Orders</p>
          </div>
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Station</th>
                  <th>Overall Progress</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in mngWorkOrderList" :key="row.id">
                  <td>{{ row.wid }}</td>
                  <td>
                    <img
                      class="img-rounded"
                      :src="row.image"
                      alt=""
                      height="50"
                    />
                  </td>
                  <td>{{ row.station_name }}</td>
                  <td>
                    <span>Built: {{ row.qty_completed }}</span>
                    <span class="float-right">Total: {{ row.qty }}</span>
                    <br />
                    <b-progress
                      class="sidebarProgress progress-xs mt-1"
                      variant="info"
                      :value="
                        Math.round(
                          ((row.qty_completed / row.qty) * 100 +
                            Number.EPSILON) *
                            100
                        ) / 100
                      "
                      :max="100"
                    />
                    <span
                      >Progress:
                      {{
                        row.qty != 0
                          ? Math.round(
                              ((row.qty_completed / row.qty) * 100 +
                                Number.EPSILON) *
                                100
                            ) / 100
                          : 0
                      }}%</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <b-modal
            id="add-work-order-modal"
            centered
            title="Add New Work Order"
          >
            <b-form-group
              label="Item ID"
              label-for="addWorkOrderID"
              invalid-feedback="Select Item ID"
            >
              <multiselect
                id="addWorkOrderID"
                label="name"
                placeholder="Select Item ID"
                track-by="name"
                v-model="addWorkOrderID"
                :options="mngIDDropdownOptions"
              ></multiselect>
            </b-form-group>
            <b-form-group
              label="QTY"
              label-for="addWorkOrderQuantity"
              invalid-feedback="Input QTY"
            >
              <b-form-input
                id="addWorkOrderQuantity"
                type="number"
                v-model="addWorkOrderQuantity"
                trim
              ></b-form-input>
            </b-form-group>
            <b-form-group
              label="STA"
              label-for="addWorkOrderStation"
              invalid-feedback="Select STA"
            >
              <multiselect
                id="addWorkOrderStation"
                label="name"
                placeholder="Select Station(s)"
                track-by="name"
                v-model="addWorkOrderStation"
                :options="mngStationDropdownOptions"
                :multiple="true"
              ></multiselect>
            </b-form-group>
            <template #modal-footer="{ cancel }">
              <b-button size="sm" variant="default" @click="cancel()">
                Cancel
              </b-button>
              <b-button size="sm" variant="success" v-on:click="addWorkOrder()">
                Add
              </b-button>
            </template>
          </b-modal>
        </b-tab>
        <b-tab title="Stations">
          <div class="d-flex justify-content-between">
            <h3><span class="fw-semi-bold">Station List</span></h3>
            <b-button
              variant="success"
              size="sm"
              v-on:click="showAddStationModal()"
              >Add New</b-button
            >
          </div>
          <div class="clearfix pt-2 pb-2">
            <p>Display All Available Stations</p>
          </div>
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Station</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in mngStationList" :key="row.id">
                  <td>{{ row.id }}</td>
                  <td>{{ row.name }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <b-modal id="add-station-modal" centered title="Add New Station">
            <b-form-group
              label="Station Name"
              label-for="stationName"
              invalid-feedback="Input Station Name"
            >
              <b-form-input
                id="addStationName"
                type="text"
                v-model="addStationName"
                trim
              ></b-form-input>
            </b-form-group>
            <template #modal-footer="{ cancel }">
              <b-button size="sm" variant="default" @click="cancel()">
                Cancel
              </b-button>
              <b-button size="sm" variant="success" v-on:click="addStation()">
                Add
              </b-button>
            </template>
          </b-modal>
        </b-tab>
        <b-tab title="Report">
          <b-row>
            <b-col>
              <h3>
                <span class="fw-semi-bold"
                  >Total Built: {{ mngBuiltCount }}</span
                >
              </h3>
            </b-col>
            <b-col>
              <b-button variant="info" class="mr-3 float-right" size="sm"
                >Parts Request</b-button
              >
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <br />
              <br />
              <h4><span class="fw-semi-bold">Report By Items</span></h4>
              <br />
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Item ID</th>
                      <th>Amount Built</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in mngWorkOrderList" :key="row.id">
                      <td>{{ row.work_id }}</td>
                      <td>{{ row.qty_completed }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </b-col>
            <b-col>
              <br />
              <br />
              <h4><span class="fw-semi-bold">Report By Station</span></h4>
              <br />
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Station</th>
                      <th>Amount Built</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in mngWorkOrderListByStation" :key="row.id">
                      <td>{{ row.station_name }}</td>
                      <td>{{ row.qty_completed }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
    </div>
    <div v-if="role == 'Developer'" class="manager-page">
      <h1 class="page-title">
        Developer&nbsp;
        <small>
          <small>Management</small>
        </small>
      </h1>
      Greetings, {{ name }}!
      <br />
      <br />
      <b-tabs>
        <b-tab title="Work Items" active>
          <div class="d-flex justify-content-between">
            <h3><span class="fw-semi-bold">Work Items List</span></h3>
            <b-button
              id="addWorkButton"
              variant="success"
              size="sm"
              v-on:click="showAddWorkModal()"
              >Add New</b-button
            >
          </div>
          <div class="clearfix pt-2 pb-2">
            <p>Display All Available Work Items</p>
          </div>
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Description</th>
                  <th>Instruction Text</th>
                  <th>Instruction Photo</th>
                  <th>Instruction Video</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in mngWorkList" :key="row.id">
                  <td>{{ row.wid }}</td>
                  <td>
                    <img
                      class="img-rounded"
                      :src="row.image"
                      alt=""
                      height="50"
                    />
                  </td>
                  <td>
                    <p class="text-max-5-lines">{{ row.description }}</p>
                  </td>
                  <td>
                    <p class="text-max-5-lines">{{ row.instruction_text }}</p>
                  </td>
                  <td>
                    <b-button
                      size="sm"
                      variant="primary"
                      v-on:click="viewWorkPhoto(row.instruction_photo)"
                      ><i class="fa fa-eye"></i>&nbsp; View</b-button
                    >
                  </td>
                  <td>
                    <b-button
                      size="sm"
                      variant="primary"
                      v-on:click="viewWorkVideo(row.instruction_video)"
                      ><i class="fa fa-eye"></i>&nbsp; View</b-button
                    >
                  </td>
                  <td>
                    <b-button-group>
                      <b-button
                        size="sm"
                        variant="primary"
                        v-on:click="showWorkEditModal(row.id)"
                        ><i class="fa fa-edit"></i
                      ></b-button>
                      <b-button
                        size="sm"
                        variant="danger"
                        v-on:click="deleteWork(row.id)"
                        ><i class="fa fa-trash"></i
                      ></b-button>
                    </b-button-group>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <b-modal
            id="view-work-photo"
            centered
            title="Instruction Photo"
            size="lg"
          >
            <img
              class="img-rounded"
              :src="viewWorkPhotoUrl"
              alt=""
              height="500"
            />
            <template #modal-footer="{ cancel }">
              <b-button size="sm" variant="default" @click="cancel()">
                Close
              </b-button>
            </template>
          </b-modal>
          <b-modal
            id="view-work-video"
            centered
            size="lg"
            title="Instruction Video"
          >
            <my-video
              :sources="viewWorkVideoSource"
              :options="{ autoplay: true, volume: 1 }"
            ></my-video>
            <template #modal-footer="{ cancel }">
              <b-button size="sm" variant="default" @click="cancel()">
                Close
              </b-button>
            </template>
          </b-modal>
          <b-modal id="add-work-modal" centered title="Add New Work Item">
            <b-form-group
              label="Item ID"
              label-for="addWorkItemID"
              invalid-feedback="Input Item ID"
            >
              <b-input-group>
                <b-form-input
                  id="addWorkItemID"
                  type="text"
                  v-model="addWorkItemID"
                  trim
                ></b-form-input>
                <b-input-group-append>
                  <b-button
                    size="sm"
                    variant="info"
                    v-on:click="generateRandomWid()"
                  >
                    Auto Generate
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
            <b-form-group
              label="Image"
              label-for="addWorkImage"
              invalid-feedback="Choose Image"
            >
              <vue-dropzone
                id="addWorkImage"
                :options="{
                  uploadMultiple: false,
                  maxFilesize: 4,
                  url: 'http://localhost:4000/api/upload-image',
                  acceptdFiles: 'image/*',
                  thumbnailWidth: 150,
                  thumbnailHeight: 150,
                  addRemoveLinks: true,
                }"
                :useCustomSlot="true"
                v-on:vdropzone-file-added="addWorkImageFileAdded"
                v-on:vdropzone-complete="addWorkImageFileUploaded"
              >
                <div class="dz-message-content">Drag Image File To Upload</div>
              </vue-dropzone>
            </b-form-group>
            <b-form-group
              label="Description"
              label-for="addWorkDescription"
              invalid-feedback="Input Description"
            >
              <b-form-input
                id="addWorkDescription"
                type="text"
                v-model="addWorkDescription"
                trim
              ></b-form-input>
            </b-form-group>
            <b-form-group
              label="Instruction Text"
              label-for="addWorkInstructionText"
              invalid-feedback="Input Instruction Text"
            >
              <b-form-textarea
                id="addWorkInstructionText"
                type="text"
                v-model="addWorkInstructionText"
                rows="5"
                min-rows="5"
              ></b-form-textarea>
            </b-form-group>
            <b-form-group
              label="Instruction Video"
              label-for="addWorkInstructionVideo"
              invalid-feedback="Choose Video"
            >
              <vue-dropzone
                id="addWorkInstructionVideo"
                :options="{
                  uploadMultiple: false,
                  maxFilesize: 500,
                  acceptdFiles: 'video/*',
                  url: 'http://localhost:4000/api/upload-video',
                  thumbnailWidth: 150,
                  thumbnailHeight: 150,
                  addRemoveLinks: true,
                }"
                :useCustomSlot="true"
                v-on:vdropzone-file-added="addWorkInstructionVideoFileAdded"
                v-on:vdropzone-complete="addWorkInstructionVideoFileUploaded"
              >
                <div class="dz-message-content">Drag Video File To Upload</div>
              </vue-dropzone>
            </b-form-group>
            <b-form-group
              label="Instruction Photo"
              label-for="addWorkInstructionPhoto"
              invalid-feedback="Choose Image"
            >
              <vue-dropzone
                id="addWorkInstructionPhoto"
                :options="{
                  uploadMultiple: false,
                  maxFilesize: 4,
                  acceptdFiles: 'image/*',
                  url: 'http://localhost:4000/api/upload-image',
                  thumbnailWidth: 150,
                  thumbnailHeight: 150,
                  addRemoveLinks: true,
                }"
                :useCustomSlot="true"
                v-on:vdropzone-file-added="addWorkInstructionPhotoFileAdded"
                v-on:vdropzone-complete="addWorkInstructionPhotoFileUploaded"
              >
                <div class="dz-message-content">Drag Image File To Upload</div>
              </vue-dropzone>
            </b-form-group>
            <template #modal-footer="{ cancel }">
              <b-button size="sm" variant="default" @click="cancel()">
                Cancel
              </b-button>
              <b-button size="sm" variant="success" v-on:click="addWork()">
                Add
              </b-button>
            </template>
          </b-modal>
        </b-tab>
      </b-tabs>
    </div>
    <div v-if="role == 'Assembler'" class="worker-page">
      <h1 class="page-title">
        Assembler
        <small>{{ stationName }}</small>
      </h1>
      Greetings, {{ name }}!
      <br />
      <br />
      <b-row>
        <b-col xs="12" lg="6" class="mb-5">
          <div class="d-flex justify-content-between">
            <h3><span class="fw-semi-bold">Work Order List</span></h3>
            <b-button variant="info" size="sm">Parts Request</b-button>
          </div>
          <div class="clearfix pt-2 pb-2">
            <p>Display Requested Works</p>
          </div>
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Qty Remaining</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in assWorkOrderList" :key="row.id">
                  <td>{{ row.work_id }}</td>
                  <td>
                    <img
                      class="img-rounded"
                      :src="row.image"
                      alt=""
                      height="30"
                    />
                  </td>
                  <td>
                    {{ row.qty - row.qty_completed - row.qty_in_progress }}
                  </td>
                  <td>
                    <b-badge
                      v-if="row.qty_completed == row.qty"
                      variant="success"
                      pill
                      >Completed</b-badge
                    >
                    <b-badge
                      v-if="
                        row.qty_completed < row.qty &&
                        (row.qty_completed > 0 || row.qty_in_progress > 0)
                      "
                      variant="info"
                      pill
                      >In Progress</b-badge
                    >
                    <b-badge
                      v-if="row.qty_completed == 0 && row.qty_in_progress == 0"
                      variant="gray"
                      pill
                      >Pending</b-badge
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-col>
        <b-col
          v-if="Object.keys(assSubWorkOrderInProgress).length > 0"
          xs="12"
          lg="6"
          class="mb-5"
        >
          <div class="d-flex justify-content-between">
            <h3>
              <span class="fw-semi-bold"
                >Item: {{ assSubWorkOrderInProgress.work_id }} ({{
                  assSubWorkOrderInProgress.sub_work_order_id
                }})</span
              >
            </h3>
            <b-button variant="success" size="sm" v-on:click="markAsComplete()"
              >Mark as Complete</b-button
            >
          </div>
          <div class="clearfix pt-4 pb-2">
            <p>{{ assSubWorkOrderInProgress.instruction_text }}</p>
          </div>
          <img
            src="../../assets/people/1.png"
            alt="..."
            style="width: 100%; max-width: 450px"
          />
          <div class="pt-5 w-100">
            <b-button
              variant="warning"
              class="float-right"
              size="sm"
              v-on:click="showMaterialsModal()"
              >Materials</b-button
            >
            <b-button
              variant="default"
              class="mr-3 float-right"
              size="sm"
              v-on:click="showStackingModal()"
              >Stacking</b-button
            >
            <b-button
              variant="dark"
              class="mr-3 float-right"
              size="sm"
              v-on:click="showInstructionsModal()"
              >Instructions</b-button
            >
          </div>
        </b-col>
      </b-row>
      <b-modal id="instructions-modal" size="lg" centered title="Instructions">
        <div
          style="width: 100%; height: 400px"
          class="d-flex justify-content-center align-items-center"
        >
          <p>This modal will be explaining how to assemble the item.</p>
        </div>
        <template #modal-footer="{ cancel }">
          <b-button size="sm" variant="default" @click="cancel()">
            Close
          </b-button>
        </template>
      </b-modal>
      <b-modal id="stacking-modal" size="lg" centered title="Stacking">
        <div
          style="width: 100%; height: 400px"
          class="d-flex justify-content-center align-items-center"
        >
          <p>Stacking Placeholder</p>
        </div>
        <template #modal-footer="{ cancel }">
          <b-button size="sm" variant="default" @click="cancel()">
            Close
          </b-button>
        </template>
      </b-modal>
      <b-modal id="materials-modal" size="lg" centered title="Materials">
        <div
          style="width: 100%; height: 400px"
          class="d-flex justify-content-center align-items-center"
        >
          <p>Materials Placeholder</p>
        </div>
        <template #modal-footer="{ cancel }">
          <b-button size="sm" variant="default" @click="cancel()">
            Close
          </b-button>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
import Widget from "@/components/Widget/Widget";
import Multiselect from "vue-multiselect";
import vue2Dropzone from "vue2-dropzone";
import myVideo from "vue-video";

export default {
  name: "ManagerDashboard",
  sockets: {
    connect: function () {},
    fetchData: function (data) {
      let helper = {};
      this.addWorkOrderID = null;
      this.mngWorkList = data.mngWorkList;
      for (let i = 0; i < this.mngWorkList.length; i++) {
        if (
          this.mngWorkList[i].image != undefined &&
          this.mngWorkList[i].image.length > 0
        ) {
          this.mngWorkList[i].image = "/images/" + this.mngWorkList[i].image;
        }
        if (
          this.mngWorkList[i].instruction_video != undefined &&
          this.mngWorkList[i].instruction_video.length > 0
        ) {
          this.mngWorkList[i].instruction_video =
            "/videos/" + this.mngWorkList[i].instruction_video;
        }
        if (
          this.mngWorkList[i].instruction_photo != undefined &&
          this.mngWorkList[i].instruction_photo.length > 0
        ) {
          this.mngWorkList[i].instruction_photo =
            "/images/" + this.mngWorkList[i].instruction_photo;
        }
      }
      this.mngIDDropdownOptions = [];
      for (let i = 0; i < this.mngWorkList.length; i++) {
        this.mngIDDropdownOptions.push({
          value: this.mngWorkList[i].id,
          name: this.mngWorkList[i].wid,
        });
      }
      this.addWorkOrderStation = null;
      this.mngWorkOrderList = data.mngWorkOrderList;
      for (let i = 0; i < this.mngWorkOrderList.length; i++) {
        if (
          this.mngWorkOrderList[i].image != undefined &&
          this.mngWorkOrderList[i].image.length > 0
        ) {
          this.mngWorkOrderList[i].image =
            "/images/" + this.mngWorkOrderList[i].image;
        }
      }
      this.mngWorkOrderListByStation = [];
      this.mngWorkOrderListByStation = this.mngWorkOrderList.reduce(function (
        r,
        o
      ) {
        var key = o.station_id;
        if (!helper[key]) {
          helper[key] = Object.assign({}, o);
          r.push(helper[key]);
        } else {
          helper[key].qty += o.qty;
          helper[key].qty_completed += o.qty_completed;
        }
        return r;
      },
      []);
      this.mngStationList = data.mngStationList;
      this.mngStationDropdownOptions = [];
      for (let i = 0; i < this.mngStationList.length; i++) {
        this.mngStationDropdownOptions.push({
          value: this.mngStationList[i].id,
          name: this.mngStationList[i].name,
        });
      }
      this.mngBuiltCount = 0;
      for (let i = 0; i < this.mngWorkOrderList.length; i++) {
        this.mngBuiltCount += this.mngWorkOrderList[i].qty_completed;
      }
      this.assWorkOrderList = [];
      if (this.role == "Assembler") {
        for (let i = 0; i < this.mngWorkOrderList.length; i++) {
          if (this.mngWorkOrderList[i].station_name == this.stationName) {
            this.assWorkOrderList.push(this.mngWorkOrderList[i]);
          }
        }
      }
      this.assSubWorkOrderList = [];
      if (this.role == "Assembler") {
        this.assSubWorkOrderList = data.assSubWorkOrderList;
      }
      this.assSubWorkOrderInProgress = {};
      if (
        this.mngIDDropdownOptions == undefined ||
        this.mngIDDropdownOptions.length == 0 ||
        this.mngStationDropdownOptions == undefined ||
        this.mngStationDropdownOptions.length == 0
      ) {
        this.addWorkOrderDisabled = true;
      } else {
        this.addWorkOrderDisabled = false;
      }
      if (this.role == "Assembler") {
        let hasWork = false;
        let nextWorkOrderId = 0;
        let nextSubWorkOrderId = 0;
        for (let i = 0; i < this.assSubWorkOrderList.length; i++) {
          const item = this.assSubWorkOrderList[i];
          if (
            item.assembler_id == undefined &&
            item.status == "Pending" &&
            nextSubWorkOrderId == 0
          ) {
            nextSubWorkOrderId = item.sub_work_order_id;
            nextWorkOrderId = item.work_order_id;
          }
          if (
            item.assembler_id != undefined &&
            item.assembler_id == this.userid &&
            this.assSubWorkOrderList[i].status == "In Progress"
          ) {
            this.assSubWorkOrderInProgress = item;
            hasWork = true;
            break;
          }
        }
        if (
          hasWork == false &&
          nextWorkOrderId != 0 &&
          nextSubWorkOrderId != 0
        ) {
          this.$socket.emit("obtainTask", {
            assembler_id: this.userid,
            work_order_id: nextWorkOrderId,
            sub_work_order_id: nextSubWorkOrderId,
          });
        }
      }
    },
  },
  components: {
    Widget,
    Multiselect,
    vueDropzone: vue2Dropzone,
    myVideo,
  },
  data() {
    return {
      userid: 0,
      name: "",
      username: "",
      email: "",
      role: "",
      stationName: "",

      addWorkItemID: "",
      addWorkImage: null,
      addWorkImageUploaded: 0,
      addWorkDescription: "",
      addWorkInstructionText: "",
      addWorkInstructionPhoto: null,
      addWorkInstructionPhotoUploaded: 0,
      addWorkInstructionVideo: null,
      addWorkInstructionVideoUploaded: 0,
      viewWorkVideoSource: null,
      viewWorkPhotoUrl: null,

      mngWorkList: [], // Work List
      mngIDDropdownOptions: [],
      mngWorkOrderList: [], // Work Order List
      mngWorkOrderListByStation: [],
      mngStationList: [], // Station List
      mngStationDropdownOptions: [],
      mngBuiltCount: 0,

      addWorkOrderDisabled: false,
      addWorkOrderID: "",
      addWorkOrderQuantity: "",
      addWorkOrderStation: null,
      addStationName: "",

      assWorkOrderList: [],
      assSubWorkOrderList: [],
      assSubWorkOrderInProgress: {},
    };
  },
  methods: {
    generateRandomWid: function () {
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      for (let i = 0; i < 20; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      this.addWorkItemID = result;
    },
    showAddWorkModal: function () {
      this.addWorkItemID = "";
      this.addWorkImage = null;
      this.addWorkImageUploaded = 0;
      this.addWorkDescription = "";
      this.addWorkInstructionText = "";
      this.addWorkInstructionPhoto = null;
      this.addWorkInstructionPhotoUploaded = 0;
      this.addWorkInstructionVideo = null;
      this.addWorkInstructionVideoUploaded = 0;

      this.$bvModal.show("add-work-modal");
    },
    addWork: function () {
      if (this.addWorkItemID.length != 20) {
        // eslint-disable-next-line no-console
        console.log("Item ID is required.");
        return;
      }
      if (this.addWorkImageUploaded == 0) {
        // eslint-disable-next-line no-console
        console.log("This field is required.");
        return;
      }
      if (this.addWorkImageUploaded == 1) {
        // eslint-disable-next-line no-console
        console.log("Image file is being uploaded. Please wait...");
        return;
      }
      if (this.addWorkInstructionVideoUploaded == 1) {
        // eslint-disable-next-line no-console
        console.log("Instruction Video file is being uploaded. Please wait...");
        return;
      }
      if (this.addWorkInstructionPhotoUploaded == 1) {
        // eslint-disable-next-line no-console
        console.log("Instruction Photo file is being uploaded. Please wait...");
        return;
      }
      this.$socket.emit("addWork", {
        wid: this.addWorkItemID,
        image: this.addWorkImage,
        description: this.addWorkDescription,
        instruction_text: this.addWorkInstructionText,
        instruction_photo: this.addWorkInstructionPhoto,
        instruction_video: this.addWorkInstructionVideo,
      });
      this.$bvModal.hide("add-work-modal");
    },
    addWorkImageFileAdded: function () {
      this.addWorkImageUploaded = 1;
    },
    addWorkImageFileUploaded: function (file) {
      this.addWorkImageUploaded = 2;
      this.addWorkImage = file.name;
    },
    addWorkInstructionVideoFileAdded: function () {
      this.addWorkInstructionVideoUploaded = 1;
    },
    addWorkInstructionVideoFileUploaded: function (file) {
      this.addWorkInstructionVideoUploaded = 2;
      this.addWorkInstructionVideo = file.name;
    },
    addWorkInstructionPhotoFileAdded: function () {
      this.addWorkInstructionPhotoUploaded = 1;
    },
    addWorkInstructionPhotoFileUploaded: function (file) {
      this.addWorkInstructionPhotoUploaded = 2;
      this.addWorkInstructionPhoto = file.name;
    },
    viewWorkPhoto: function (photoUrl) {
      this.viewWorkPhotoUrl = null;
      this.viewWorkPhotoUrl = photoUrl;
      this.$bvModal.show("view-work-photo");
    },
    viewWorkVideo: function (videoUrl) {
      this.viewWorkVideoSource = null;
      this.viewWorkVideoSource = [
        {
          src: videoUrl,
          type: "video/mp4",
        },
      ];
      this.$bvModal.show("view-work-video");
    },
    showAddWorkOrderModal: function () {
      this.addWorkOrderID = null;
      this.addWorkOrderQuantity = "";
      this.addWorkOrderStation = null;
      this.$bvModal.show("add-work-order-modal");
    },
    addWorkOrder: function () {
      let stations = [];
      for (let i = 0; i < this.addWorkOrderStation.length; i++) {
        stations.push(this.addWorkOrderStation[i].value);
      }
      if (stations.length > 0) {
        this.$socket.emit("addWorkOrder", {
          work_id: this.addWorkOrderID.value,
          qty: this.addWorkOrderQuantity,
          station_ids: stations,
        });
      }
      this.$bvModal.hide("add-work-order-modal");
    },
    showAddStationModal: function () {
      this.addStationName = "";
      this.$bvModal.show("add-station-modal");
    },
    addStation: function () {
      this.$socket.emit("addStation", {
        name: this.addStationName,
      });
      this.$bvModal.hide("add-station-modal");
    },
    markAsComplete: function () {
      this.$socket.emit("markAsComplete", {
        work_order_id: this.assSubWorkOrderInProgress.work_order_id,
        sub_work_order_id: this.assSubWorkOrderInProgress.sub_work_order_id,
      });
    },
    showInstructionsModal: function () {
      this.$bvModal.show("instructions-modal");
    },
    showStackingModal: function () {
      this.$bvModal.show("stacking-modal");
    },
    showMaterialsModal: function () {
      this.$bvModal.show("materials-modal");
    },
  },
  mounted() {
    this.userid = window.localStorage.getItem("userid");
    this.name = window.localStorage.getItem("name");
    this.username = window.localStorage.getItem("username");
    this.email = window.localStorage.getItem("email");
    this.role = window.localStorage.getItem("role");
    this.stationName = window.localStorage.getItem("stationname");

    this.$socket.emit("updateData");
  },
};
</script>

<style src="./Dashboard.scss" lang="scss" />
<style src="./multiselect.css" lang="css" />
<style src="./dropzone.css" lang="css" />
