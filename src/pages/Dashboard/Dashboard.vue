<template>
  <div class="visits-page">
    <div v-if="role == 'Manager'" class="manager-page">
      <h1 class="page-title">Manager&nbsp;<small><small>Assembly Department</small></small></h1>
      Greetings, {{ name }}!
      <br />
      <br />
      <b-tabs>
        <b-tab title="Work Orders" active>
          <div class="d-flex justify-content-between">
            <h3><span class="fw-semi-bold">Work Order List</span></h3>
            <b-button id="addWorkOrderButton" :disabled="addWorkOrderDisabled" variant="success" size="sm" v-on:click="showAddWorkOrderModal()">Add New</b-button>
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
                  <td><img class="img-rounded" :src="row.image" height="50"/></td>
                  <td>{{ row.station_name }}</td>
                  <td>
                    <span>Built: {{ row.qty_completed }}</span>
                    <span class="float-right">Total: {{ row.qty }}</span>
                    <br />
                    <b-progress class="sidebarProgress progress-xs mt-1" variant="info" :value=" Math.round(((row.qty_completed / row.qty) * 100 + Number.EPSILON) * 100) / 100" :max="100"/>
                    <span>Progress: {{ row.qty != 0 ? Math.round(((row.qty_completed / row.qty) * 100 + Number.EPSILON) * 100) / 100 : 0 }}%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <b-modal no-close-on-backdrop id="add-work-order-modal" centered title="Add New Work Order">
            <b-form-group label="Item ID" label-for="addWorkOrderID" invalid-feedback="Select Item ID">
              <multiselect id="addWorkOrderID" label="name" placeholder="Select Item ID" track-by="name" v-model="addWorkOrderID" :options="mngIDDropdownOptions"></multiselect>
            </b-form-group>
            <b-form-group label="QTY" label-for="addWorkOrderQuantity" invalid-feedback="Input QTY">
              <b-form-input id="addWorkOrderQuantity" type="number" v-model="addWorkOrderQuantity"></b-form-input>
            </b-form-group>
            <b-form-group label="STA" label-for="addWorkOrderStation" invalid-feedback="Select STA">
              <multiselect id="addWorkOrderStation" label="name" placeholder="Select Station(s)" track-by="name" v-model="addWorkOrderStation" :options="mngStationDropdownOptions" :multiple="true"></multiselect>
            </b-form-group>
            <template #modal-footer="{ cancel }">
              <b-button size="sm" variant="default" @click="cancel()">Cancel</b-button>
              <b-button size="sm" variant="success" v-on:click="addWorkOrder()">Add</b-button>
            </template>
          </b-modal>
        </b-tab>
        <b-tab title="Stations">
          <div class="d-flex justify-content-between">
            <h3><span class="fw-semi-bold">Station List</span></h3>
            <b-button variant="success" size="sm" v-on:click="showAddStationModal()">Add New</b-button>
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
          <b-modal no-close-on-backdrop id="add-station-modal" centered title="Add New Station">
            <b-form-group label="Station Name" label-for="stationName" invalid-feedback="Input Station Name">
              <b-form-input id="addStationName" type="text" v-model="addStationName" trim></b-form-input>
            </b-form-group>
            <template #modal-footer="{ cancel }">
              <b-button size="sm" variant="default" @click="cancel()">Cancel</b-button>
              <b-button size="sm" variant="success" v-on:click="addStation()">Add</b-button>
            </template>
          </b-modal>
        </b-tab>
        <b-tab title="Report">
          <b-row>
            <b-col>
              <h3><span class="fw-semi-bold">Total Built: {{ mngBuiltCount }}</span></h3>
            </b-col>
            <b-col>
              <b-button variant="info" class="mr-3 float-right" size="sm">Parts Request</b-button>
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
      <h1 class="page-title">Developer&nbsp;<small><small>Management</small></small></h1>
      Greetings, {{ name }}!
      <br />
      <br />
      <b-tabs>
        <b-tab title="Work Items" active>
          <div class="d-flex justify-content-between">
            <h3><span class="fw-semi-bold">Work Items List</span></h3>
            <b-button id="addWorkButton" variant="success" size="sm" v-on:click="showAddWorkModal()">Add New</b-button>
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
                  <th>Materials</th>
                  <th>Instruction Text</th>
                  <th>Instruction Photo</th>
                  <th>Instruction Video</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in mngWorkList" :key="row.id">
                  <td>{{ row.wid }}</td>
                  <td><img class="img-rounded" :src="row.image" height="50"/></td>
                  <td><p class="text-max-5-lines">{{ row.description }}</p></td>
                  <td><div v-for="item in row.materials" :key="item.id">{{ item.name }} x {{ item.qty }}</div></td>
                  <td><p class="text-max-5-lines">{{ row.instruction_text }}</p></td>
                  <td><b-button size="sm" variant="primary" v-on:click="viewWorkPhoto(row.instruction_photo)"><i class="fa fa-eye"></i>&nbsp; View</b-button></td>
                  <td><b-button size="sm" variant="primary" v-on:click="viewWorkVideo(row.instruction_video)"><i class="fa fa-eye"></i>&nbsp; View</b-button></td>
                  <td>
                    <b-button-group>
                      <b-button size="sm" variant="primary"
                        v-on:click="showWorkEditModal({
                            id: row.id,
                            wid: row.wid,
                            image: row.image,
                            materials: row.materials, 
                            description: row.description,
                            instruction_text: row.instruction_text,
                            instruction_photo: row.instruction_photo,
                            instruction_video: row.instruction_video,
                          })"><i class="fa fa-edit"></i></b-button>
                      <b-button size="sm" variant="danger" v-on:click="deleteWork(row.id)"><i class="fa fa-trash"></i></b-button>
                    </b-button-group>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <b-modal no-close-on-backdrop id="view-work-photo" centered title="Instruction Photo" size="lg">
            <img class="img-rounded" :src="viewWorkPhotoUrl" style="width: 100%; height: auto; max-height: 500px"/>
            <template #modal-footer="{ cancel }">
              <b-button size="sm" variant="default" @click="cancel()">Close</b-button>
            </template>
          </b-modal>
          <b-modal no-close-on-backdrop id="view-work-video" centered size="lg" title="Instruction Video">
            <my-video :sources="viewWorkVideoSource" :options="{ autoplay: true, volume: 1 }"></my-video>
            <template #modal-footer="{ cancel }">
              <b-button size="sm" variant="default" @click="cancel()">Close</b-button>
            </template>
          </b-modal>
          <b-modal no-close-on-backdrop id="add-work-modal" centered title="Add New Work Item">
            <b-form-group label="Item ID" label-for="addWorkItemID" invalid-feedback="Input Item ID">
              <b-form-input id="addWorkItemID" type="text" v-model="addWorkItemID" trim></b-form-input>
            </b-form-group>
            <b-form-group label="Image" label-for="addWorkImage" invalid-feedback="Choose Image">
              <vue-dropzone
                id="addWorkImage"
                :options="{
                  uploadMultiple: false,
                  maxFilesize: 4,
                  url: 'http://localhost:4000/api/upload-image', // 'http://45.63.108.165:4000/api/upload-image'
                  acceptdFiles: 'image/*',
                  thumbnailWidth: 150,
                  thumbnailHeight: 150,
                  addRemoveLinks: true,
                }"
                :useCustomSlot="true"
                v-on:vdropzone-file-added="addWorkImageFileAdded"
                v-on:vdropzone-complete="addWorkImageFileUploaded">
                <div class="dz-message-content">Drag Image File To Upload</div>
              </vue-dropzone>
            </b-form-group>
            <b-form-group label="Description" label-for="addWorkDescription" invalid-feedback="Input Description">
              <b-form-input id="addWorkDescription" type="text" v-model="addWorkDescription"></b-form-input>
            </b-form-group>
            <div class="form-group">
              <b-row>
                <b-col>
                  <label for="addWorkMaterials">Materials</label>
                </b-col>
                <b-col class="d-flex justify-content-end align-items-center">
                  <b-button size="xs" variant="info" class="float-right" v-on:click="addWorkAddMaterial()">Add</b-button>
                </b-col>
              </b-row>
              <b-form-row v-for="row in addWorkMaterialList" :key="row.id" class="my-2">
                <b-col>
                  <Dropdown
                    :options="addWorkMaterialDropdownOptions"
                    :uuid="row.id"
                    v-on:selected="addWorkMaterialSelected"
                    :maxItem="10"
                    page="Dashboard"
                    placeholder="Select Material ID"></Dropdown>
                </b-col>
                <b-col>
                  <b-input-group>
                    <b-form-input type="number" placeholder="Qty" v-model="row.addWorkMaterialQty"></b-form-input>
                    <b-input-group-append>
                      <b-button size="xs" variant="danger" v-on:click="addWorkRemoveMaterial(row.id)"><i class="fa fa-trash"></i></b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-col>
              </b-form-row>
            </div>
            <b-form-group label="Instruction Text" label-for="addWorkInstructionText" invalid-feedback="Input Instruction Text">
              <b-form-textarea id="addWorkInstructionText" type="text" v-model="addWorkInstructionText" rows="5" min-rows="5"></b-form-textarea>
            </b-form-group>
            <b-form-group label="Instruction Video" label-for="addWorkInstructionVideo" invalid-feedback="Choose Video">
              <vue-dropzone
                id="addWorkInstructionVideo"
                :options="{
                  uploadMultiple: false,
                  maxFilesize: 500,
                  acceptdFiles: 'video/*',
                  url: 'http://localhost:4000/api/upload-video', // 'http://45.63.108.165:4000/api/upload-video'
                  thumbnailWidth: 150,
                  thumbnailHeight: 150,
                  addRemoveLinks: true,
                }"
                :useCustomSlot="true"
                v-on:vdropzone-file-added="addWorkInstructionVideoFileAdded"
                v-on:vdropzone-complete="addWorkInstructionVideoFileUploaded">
                <div class="dz-message-content">Drag Video File To Upload</div>
              </vue-dropzone>
            </b-form-group>
            <b-form-group label="Instruction Photo" label-for="addWorkInstructionPhoto" invalid-feedback="Choose Image">
              <vue-dropzone
                id="addWorkInstructionPhoto"
                :options="{
                  uploadMultiple: false,
                  maxFilesize: 4,
                  acceptdFiles: 'image/*',
                  url: 'http://localhost:4000/api/upload-image', // 'http://45.63.108.165:4000/api/upload-image'
                  thumbnailWidth: 150,
                  thumbnailHeight: 150,
                  addRemoveLinks: true,
                }"
                :useCustomSlot="true"
                v-on:vdropzone-file-added="addWorkInstructionPhotoFileAdded"
                v-on:vdropzone-complete="addWorkInstructionPhotoFileUploaded">
                <div class="dz-message-content">Drag Image File To Upload</div>
              </vue-dropzone>
            </b-form-group>
            <template #modal-footer="{ cancel }">
              <b-button size="sm" variant="default" @click="cancel()">Cancel</b-button>
              <b-button size="sm" variant="success" v-on:click="addWork()">Add</b-button>
            </template>
          </b-modal>
          <b-modal no-close-on-backdrop id="edit-work-modal" centered title="Edit Work Item">
            <input type="hidden" id="editWorkID" :value="editWorkID"/>
            <b-form-group label="Item ID" label-for="editWorkItemID" invalid-feedback="Input Item ID">
              <b-form-input id="editWorkItemID" type="text" v-model="editWorkItemID" trim></b-form-input>
            </b-form-group>
            <b-form-group label="Image" label-for="editWorkImage" invalid-feedback="Choose Image">
              <vue-dropzone
                id="editWorkImage"
                :options="{
                  uploadMultiple: false,
                  maxFilesize: 4,
                  url: 'http://localhost:4000/api/upload-image', // 'http://45.63.108.165:4000/api/upload-image'
                  acceptdFiles: 'image/*',
                  thumbnailWidth: 150,
                  thumbnailHeight: 150,
                  addRemoveLinks: true,
                }"
                :useCustomSlot="true"
                v-on:vdropzone-file-added="editWorkImageFileAdded"
                v-on:vdropzone-complete="editWorkImageFileUploaded">
                <div class="dz-message-content">Drag Image File To Upload</div>
              </vue-dropzone>
            </b-form-group>
            <b-form-group label="Description" label-for="editWorkDescription" invalid-feedback="Input Description">
              <b-form-input id="editWorkDescription" type="text" v-model="editWorkDescription"></b-form-input>
            </b-form-group>
            <b-form-group label="Instruction Text" label-for="editWorkInstructionText" invalid-feedback="Input Instruction Text">
              <b-form-textarea id="editWorkInstructionText" type="text" v-model="editWorkInstructionText" rows="5" min-rows="5"></b-form-textarea>
            </b-form-group>
            <b-form-group label="Instruction Video" label-for="editWorkInstructionVideo" invalid-feedback="Choose Video">
              <vue-dropzone
                id="editWorkInstructionVideo"
                :options="{
                  uploadMultiple: false,
                  maxFilesize: 500,
                  acceptdFiles: 'video/*',
                  url: 'http://localhost:4000/api/upload-video', // 'http://45.63.108.165:4000/api/upload-video'
                  thumbnailWidth: 150,
                  thumbnailHeight: 150,
                  addRemoveLinks: true,
                }"
                :useCustomSlot="true"
                v-on:vdropzone-file-added="editWorkInstructionVideoFileAdded"
                v-on:vdropzone-complete="editWorkInstructionVideoFileUploaded">
                <div class="dz-message-content">Drag Video File To Upload</div>
              </vue-dropzone>
            </b-form-group>
            <b-form-group label="Instruction Photo" label-for="editWorkInstructionPhoto" invalid-feedback="Choose Image">
              <vue-dropzone
                id="editWorkInstructionPhoto"
                :options="{
                  uploadMultiple: false,
                  maxFilesize: 4,
                  acceptdFiles: 'image/*',
                  url: 'http://localhost:4000/api/upload-image', // 'http://45.63.108.165:4000/api/upload-image'
                  thumbnailWidth: 150,
                  thumbnailHeight: 150,
                  addRemoveLinks: true,
                }"
                :useCustomSlot="true"
                v-on:vdropzone-file-added="editWorkInstructionPhotoFileAdded"
                v-on:vdropzone-complete="editWorkInstructionPhotoFileUploaded">
                <div class="dz-message-content">Drag Image File To Upload</div>
              </vue-dropzone>
            </b-form-group>
            <template #modal-footer="{ cancel }">
              <b-button size="sm" variant="default" @click="cancel()">Cancel</b-button>
              <b-button size="sm" variant="success" v-on:click="editWork()">Update</b-button>
            </template>
          </b-modal>
        </b-tab>
        <b-tab title="Materials">
          <div class="d-flex justify-content-between">
            <h3><span class="fw-semi-bold">Materials List</span></h3>
            <b-button id="addWorkButton" variant="success" size="sm" v-on:click="showMaterialAddModal()">Add New</b-button>
          </div>
          <div class="clearfix pt-2 pb-2">
            <p>Display All Available Materials</p>
          </div>
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in devMaterialList" :key="row.id">
                  <td>{{ row.id }}</td>
                  <td><img class="img-rounded" :src="row.image" height="50"/></td>
                  <td><p>{{ row.name }}</p></td>
                  <td><p class="text-max-5-lines">{{ row.description }}</p></td>
                  <td>
                    <b-button-group>
                      <b-button size="sm" variant="primary"
                        v-on:click="showMaterialEditModal({
                            id: row.id,
                            image: row.image,
                            name: row.name,
                            description: row.description,
                          })"><i class="fa fa-edit"></i></b-button>
                      <b-button size="sm" variant="danger" v-on:click="deleteMaterial(row.id)"><i class="fa fa-trash"></i></b-button>
                    </b-button-group>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <b-modal no-close-on-backdrop id="add-material-modal" centered title="Add New Material">
            <b-form-group label="Name" label-for="addMaterialName" invalid-feedback="Input Material Name">
              <b-form-input id="addMaterialName" type="text" v-model="addMaterialName"></b-form-input>
            </b-form-group>
            <b-form-group label="Image" label-for="addMaterialImage" invalid-feedback="Choose Image">
              <vue-dropzone
                id="addMaterialImage"
                :options="{
                  uploadMultiple: false,
                  maxFilesize: 4,
                  url: 'http://localhost:4000/api/upload-image', // 'http://45.63.108.165:4000/api/upload-image'
                  acceptdFiles: 'image/*',
                  thumbnailWidth: 150,
                  thumbnailHeight: 150,
                  addRemoveLinks: true,
                }"
                :useCustomSlot="true"
                v-on:vdropzone-file-added="addMaterialImageFileAdded"
                v-on:vdropzone-complete="addMaterialImageFileUploaded">
                <div class="dz-message-content">Drag Image File To Upload</div>
              </vue-dropzone>
            </b-form-group>
            <b-form-group label="Description" label-for="addMaterialDescription" invalid-feedback="Input Description">
              <b-form-textarea id="addMaterialDescription" type="text" v-model="addMaterialDescription" rows="5" min-rows="5"></b-form-textarea>
            </b-form-group>
            <template #modal-footer="{ cancel }">
              <b-button size="sm" variant="default" @click="cancel()">Cancel</b-button>
              <b-button size="sm" variant="success" v-on:click="addMaterial()">Add</b-button>
            </template>
          </b-modal>
          <b-modal no-close-on-backdrop id="edit-material-modal" centered title="Edit Material">
            <input type="hidden" id="editMaterialID" :value="editMaterialID"/>
            <b-form-group label="Name" label-for="editMaterialName" invalid-feedback="Input Material Name">
              <b-form-input id="editMaterialName" type="text" v-model="editMaterialName"></b-form-input>
            </b-form-group>
            <b-form-group label="Image" label-for="editMaterialImage" invalid-feedback="Choose Image">
              <vue-dropzone
                id="editWorkImage"
                :options="{
                  uploadMultiple: false,
                  maxFilesize: 4,
                  url: 'http://localhost:4000/api/upload-image', // 'http://45.63.108.165:4000/api/upload-image'
                  acceptdFiles: 'image/*',
                  thumbnailWidth: 150,
                  thumbnailHeight: 150,
                  addRemoveLinks: true,
                }"
                :useCustomSlot="true"
                v-on:vdropzone-file-added="editMaterialImageFileAdded"
                v-on:vdropzone-complete="editMaterialImageFileUploaded">
                <div class="dz-message-content">Drag Image File To Upload</div>
              </vue-dropzone>
            </b-form-group>
            <b-form-group label="Description" label-for="editMaterialDescription" invalid-feedback="Input Description">
              <b-form-textarea id="editMaterialDescription" type="text" v-model="editMaterialDescription" rows="5" min-rows="5"></b-form-textarea>
            </b-form-group>
            <template #modal-footer="{ cancel }">
              <b-button size="sm" variant="default" @click="cancel()">Cancel</b-button>
              <b-button size="sm" variant="success" v-on:click="editMaterial()">Update</b-button>
            </template>
          </b-modal>
        </b-tab>
      </b-tabs>
    </div>
    <div v-if="role == 'Assembler'" class="worker-page">
      <h1 class="page-title">Assembler<small>{{ stationName }}</small></h1>
      Greetings, {{ name }}!
      <br />
      <br />
      <b-row>
        <b-col xs="12" lg="4" class="mb-5">
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
                  <th>Item ID</th>
                  <th>Image</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in assWorkOrderList" :key="row.id">
                  <td>{{ row.wid }}</td>
                  <td><img class="img-rounded" :src="row.image" height="30"/></td>
                  <td>{{ row.qty - row.qty_completed - row.qty_in_progress }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-col>
        <b-col v-if="Object.keys(assSubWorkOrderInProgress).length > 0" xs="12" lg="8" class="mb-5">
          <div class="d-flex justify-content-between">
            <h3><span>{{ assSubWorkOrderInProgress.wid }}</span></h3>
            <b-button variant="success" size="sm" v-on:click="markAsComplete()">Mark as Complete</b-button>
          </div>
          <div class="clearfix pt-4 pb-2">
            <p>{{ assSubWorkOrderInProgress.description }}</p>
          </div>
          <img :src="assSubWorkOrderInProgress.instruction_photo" style="width: 100%; max-width: 450px"/>
          <div class="pt-5 w-100">
            <b-button variant="warning" class="float-right" size="sm" v-on:click="showMaterialsModal()">Materials</b-button>
            <b-button variant="default" class="mr-3 float-right" size="sm" v-on:click="showStackingModal()">Stacking</b-button>
            <b-button variant="dark" class="mr-3 float-right" size="sm" v-on:click="showInstructionsModal(assSubWorkOrderInProgress.instruction_video)">Instructions</b-button>
          </div>
        </b-col>
      </b-row>
      <b-modal no-close-on-backdrop id="instructions-modal" size="lg" centered title="Instructions">
        <my-video :sources="assInstructionsVideoSource" :options="{ autoplay: true, volume: 1 }"></my-video>
        <template #modal-footer="{ cancel }">
          <b-button size="sm" variant="default" @click="cancel()">Close</b-button>
        </template>
      </b-modal>
      <b-modal no-close-on-backdrop id="stacking-modal" size="lg" centered title="Stacking">
        <div style="width: 100%; height: 400px" class="d-flex justify-content-center align-items-center">
          <p>Stacking Placeholder</p>
        </div>
        <template #modal-footer="{ cancel }">
          <b-button size="sm" variant="default" @click="cancel()">Close</b-button>
        </template>
      </b-modal>
      <b-modal no-close-on-backdrop id="materials-modal" size="lg" centered title="Materials">
        <div style="width: 100%; height: 400px" class="d-flex justify-content-center align-items-center">
          <p>Materials Placeholder</p>
        </div>
        <template #modal-footer="{ cancel }">
          <b-button size="sm" variant="default" @click="cancel()">Close</b-button>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
import Dropdown from "@/components/Dropdown/Dropdown";
import Multiselect from "vue-multiselect";
import myVideo from "vue-video";
import Widget from "@/components/Widget/Widget";
import vue2Dropzone from "vue2-dropzone";

export default {
  name: "ManagerDashboard",
  sockets: {
    connect: function () {},
    fetchData: function (data) {
      let helper = {};
      this.addWorkOrderID = null;
      this.addWorkMaterialDropdownOptions = [];
      this.devMaterialList = data.devMaterialList;
      for (let i = 0; i < this.devMaterialList.length; i++) {
        this.addWorkMaterialDropdownOptions.push({
          id: this.devMaterialList[i].id, 
          name: this.devMaterialList[i].name
        });
      }
      this.mngWorkList = data.mngWorkList;
      for (let i = 0; i < this.mngWorkList.length; i++) {
        if (this.mngWorkList[i].image != undefined && this.mngWorkList[i].image.length > 0) {
          this.mngWorkList[i].image = "/images/" + this.mngWorkList[i].image;
        }
        if (this.mngWorkList[i].instruction_video != undefined && this.mngWorkList[i].instruction_video.length > 0) {
          this.mngWorkList[i].instruction_video = "/videos/" + this.mngWorkList[i].instruction_video;
        }
        if (this.mngWorkList[i].instruction_photo != undefined && this.mngWorkList[i].instruction_photo.length > 0) {
          this.mngWorkList[i].instruction_photo = "/images/" + this.mngWorkList[i].instruction_photo;
        }
        this.mngWorkList[i].materials = [];
        const materialIds = this.mngWorkList[i].material_ids.split(',');
        const materialQtys = this.mngWorkList[i].material_qtys.split(',');
        for (let j = 0; j < materialIds.length; j++) {
          const materialName = this.devMaterialList.find(it => it.id == materialIds[j]).name;
          this.mngWorkList[i].materials.push({
            id: materialIds[j], 
            name: materialName, 
            qty: materialQtys[j]
          });
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
        if (this.mngWorkOrderList[i].image != undefined && this.mngWorkOrderList[i].image.length > 0) {
          this.mngWorkOrderList[i].image = "/images/" + this.mngWorkOrderList[i].image;
        }
      }
      this.mngWorkOrderListByStation = [];
      this.mngWorkOrderListByStation = this.mngWorkOrderList.reduce(function (r, o) {
        var key = o.station_id;
        if (!helper[key]) {
          helper[key] = Object.assign({}, o);
          r.push(helper[key]);
        } else {
          helper[key].qty += o.qty;
          helper[key].qty_completed += o.qty_completed;
        }
        return r;
      }, []);
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
        for (let i = 0; i < this.assSubWorkOrderList.length; i++) {
          if (this.assSubWorkOrderList[i].image != undefined && this.assSubWorkOrderList[i].image.length > 0) {
            this.assSubWorkOrderList[i].image = "/images/" + this.assSubWorkOrderList[i].image;
          }
          if (this.assSubWorkOrderList[i].instruction_video != undefined && this.assSubWorkOrderList[i].instruction_video.length > 0) {
            this.assSubWorkOrderList[i].instruction_video = "/videos/" + this.assSubWorkOrderList[i].instruction_video;
          }
          if (this.assSubWorkOrderList[i].instruction_photo != undefined && this.assSubWorkOrderList[i].instruction_photo.length > 0) {
            this.assSubWorkOrderList[i].instruction_photo = "/images/" + this.assSubWorkOrderList[i].instruction_photo;
          }
        }
      }
      this.assSubWorkOrderInProgress = {};
      if (this.mngIDDropdownOptions == undefined ||
        this.mngIDDropdownOptions.length == 0 ||
        this.mngStationDropdownOptions == undefined ||
        this.mngStationDropdownOptions.length == 0) {
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
          if (item.assembler_id == undefined && item.status == "Pending" && nextSubWorkOrderId == 0) {
            nextSubWorkOrderId = item.sub_work_order_id;
            nextWorkOrderId = item.work_order_id;
          }
          if (item.assembler_id != undefined && item.assembler_id == this.userid && this.assSubWorkOrderList[i].status == "In Progress") {
            this.assSubWorkOrderInProgress = item;
            hasWork = true;
            break;
          }
        }
        if (hasWork == false && nextWorkOrderId != 0 && nextSubWorkOrderId != 0) {
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
    Dropdown,
    Multiselect,
    myVideo,
    Widget,
    vueDropzone: vue2Dropzone,
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
      addWorkMaterialList: [],
      addWorkMaterialDropdownOptions: [],
      addWorkInstructionText: "",
      addWorkInstructionPhoto: null,
      addWorkInstructionPhotoUploaded: 0,
      addWorkInstructionVideo: null,
      addWorkInstructionVideoUploaded: 0,
      viewWorkVideoSource: null,
      viewWorkPhotoUrl: null,

      editWorkID: "",
      editWorkItemID: "",
      editWorkImage: null,
      editWorkImageUploaded: 0,
      editWorkDescription: "",
      editWorkInstructionText: "",
      editWorkInstructionPhoto: null,
      editWorkInstructionPhotoUploaded: 0,
      editWorkInstructionVideo: null,
      editWorkInstructionVideoUploaded: 0,

      addMaterialName: null, 
      addMaterialImage: null, 
      addMaterialImageUploaded: 0, 
      addMaterialDescription: null, 

      editMaterialID: null, 
      editMaterialName: null, 
      editMaterialImage: null, 
      editMaterialImageUploaded: 0, 
      editMaterialDescription: null, 

      devMaterialList: [], // Material List

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
      assInstructionsVideoSource: null,
    };
  },
  methods: {
    // Material
    showMaterialAddModal: function () {
      this.addMaterialName = null;
      this.addMaterialImage = null;
      this.addMaterialImageUploaded = 0;
      this.addMaterialDescription = null;
      this.$bvModal.show("add-material-modal");
    },
    showMaterialEditModal: function (data) {
      this.editMaterialID = data.id;
      this.editMaterialName = data.name;
      this.editMaterialImage = data.image;
      this.editMaterialImageUploaded = 0;
      this.editMaterialDescription = data.description;
      this.$bvModal.show("edit-material-modal");
    },
    addMaterial: function () {
      if (this.addMaterialName.length == 0) {
        // eslint-disable-next-line no-console
        console.log("Name is required.");
        return;
      }
      if (this.addMaterialImageUploaded == 0) {
        // eslint-disable-next-line no-console
        console.log("This field is required.");
        return;
      }
      if (this.addMaterialImageUploaded == 1) {
        // eslint-disable-next-line no-console
        console.log("Image file is being uploaded. Please wait...");
        return;
      }
      this.$socket.emit("addMaterial", {
        name: this.addMaterialName,
        image: this.addMaterialImage,
        description: this.addMaterialDescription,
      });
      this.$bvModal.hide("add-material-modal");
    },
    editMaterial: function () {
      if (this.editMaterialID.length == 0) {
        // eslint-disable-next-line no-console
        console.log("ID is required.");
        return;
      }
      if (this.editMaterialName.length == 0) {
        // eslint-disable-next-line no-console
        console.log("Name is required.");
        return;
      }
      if (this.editMaterialImageUploaded == 1) {
        // eslint-disable-next-line no-console
        console.log("Image file is being uploaded. Please wait...");
        return;
      }
      this.$socket.emit("editMaterial", {
        id: this.editMaterialID,
        name: this.editMaterialName,
        image: this.editMaterialImageUploaded == 2 ? this.editMaterialImage : "",
        description: this.editMaterialDescription,
      });
      this.$bvModal.hide("edit-material-modal");
    },
    deleteMaterial: function (id) {
      if (id == undefined || id.length == 0) {
        // eslint-disable-next-line no-console
        console.log("ID is required.");
        return;
      }
      this.$socket.emit("deleteMaterial", {
        id: id,
      });
    },
    addMaterialImageFileAdded: function () {
      this.addMaterialImageUploaded = 1;
    },
    addMaterialImageFileUploaded: function (file) {
      this.addMaterialImageUploaded = 2;
      this.addMaterialImage = file.name;
    },
    editMaterialImageFileAdded: function () {
      this.editMaterialImageUploaded = 1;
    },
    editMaterialImageFileUploaded: function (file) {
      this.editMaterialImageUploaded = 2;
      this.editMaterialImage = file.name;
    },
    // Work
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
    showWorkEditModal: function (data) {
      this.editWorkID = "";
      this.editWorkID = data.id;
      this.editWorkItemID = data.wid;
      this.editWorkImage = data.image;
      this.editWorkImageUploaded = 0;
      this.editWorkDescription = data.description;
      this.editWorkInstructionText = data.instruction_text;
      this.editWorkInstructionPhoto = data.instruction_photo;
      this.editWorkInstructionVideo = data.instruction_video;
      this.editWorkInstructionPhotoUploaded = 0;
      this.editWorkInstructionVideoUploaded = 0;

      this.$bvModal.show("edit-work-modal");
    },
    addWork: function () {
      if (this.addWorkItemID.length == 0) {
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
      let materialIDs = [];
      let materialQtys = [];
      for (let i = 0; i < this.addWorkMaterialList.length; i++) {
        if (this.addWorkMaterialList[i].addWorkMaterialID != null && this.addWorkMaterialList[i].addWorkMaterialQty != null) {
          materialIDs.push(this.addWorkMaterialList[i].addWorkMaterialID);
          materialQtys.push(this.addWorkMaterialList[i].addWorkMaterialQty);
        }
      }
      this.$socket.emit("addWork", {
        wid: this.addWorkItemID,
        image: this.addWorkImage,
        description: this.addWorkDescription,
        material_names: materialNames.join(','), 
        material_qtys: materialQtys.join(','), 
        instruction_text: this.addWorkInstructionText,
        instruction_photo: this.addWorkInstructionPhoto,
        instruction_video: this.addWorkInstructionVideo,
      });
      this.$bvModal.hide("add-work-modal");
    },
    editWork: function () {
      if (this.editWorkID.length == 0) {
        // eslint-disable-next-line no-console
        console.log("ID is required.");
        return;
      }
      if (this.editWorkItemID.length == 0) {
        // eslint-disable-next-line no-console
        console.log("Item ID is required.");
        return;
      }
      if (this.editWorkImageUploaded == 1) {
        // eslint-disable-next-line no-console
        console.log("Image file is being uploaded. Please wait...");
        return;
      }
      if (this.editWorkInstructionVideoUploaded == 1) {
        // eslint-disable-next-line no-console
        console.log("Instruction Video file is being uploaded. Please wait...");
        return;
      }
      if (this.editWorkInstructionPhotoUploaded == 1) {
        // eslint-disable-next-line no-console
        console.log("Instruction Photo file is being uploaded. Please wait...");
        return;
      }
      this.$socket.emit("editWork", {
        id: this.editWorkID,
        wid: this.editWorkItemID,
        image: this.editWorkImageUploaded == 2 ? this.editWorkImage : "",
        description: this.editWorkDescription,
        instruction_text: this.editWorkInstructionText,
        instruction_photo:
          this.editWorkInstructionPhotoUploaded == 2
            ? this.editWorkInstructionPhoto
            : "",
        instruction_video:
          this.editWorkInstructionVideoUploaded == 2
            ? this.editWorkInstructionVideo
            : "",
      });
      this.$bvModal.hide("edit-work-modal");
    },
    deleteWork: function (id) {
      if (id == undefined || id.length == 0) {
        // eslint-disable-next-line no-console
        console.log("ID is required.");
        return;
      }
      this.$socket.emit("deleteWork", {
        id: id,
      });
    },
    addWorkMaterialSelected: function (uuid, data) {
      for (let i = 0; i < this.addWorkMaterialList.length; i++) {
        if (this.addWorkMaterialList[i].id == uuid) {
          this.addWorkMaterialList[i].addWorkMaterialID = data.id;
          this.addWorkMaterialList[i].addWorkMaterialName = data.name;
          break;
        }
      }
    },
    addWorkAddMaterial: function () {
      const count = this.addWorkMaterialList.length;
      this.addWorkMaterialList.push({
        id: count + 1,
        addWorkMaterialID: null,
        addWorkMaterialName: null,
        addWorkMaterialQty: null,
      });
    },
    addWorkRemoveMaterial: function (id) {
      for (let i = 0; i < this.addWorkMaterialList.length; i++) {
        if ( this.addWorkMaterialList[i].id == id) { 
            this.addWorkMaterialList.splice(i, 1); 
            break;
        }
      }
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
    editWorkImageFileAdded: function () {
      this.editWorkImageUploaded = 1;
    },
    editWorkImageFileUploaded: function (file) {
      this.editWorkImageUploaded = 2;
      this.editWorkImage = file.name;
    },
    editWorkInstructionVideoFileAdded: function () {
      this.editWorkInstructionVideoUploaded = 1;
    },
    editWorkInstructionVideoFileUploaded: function (file) {
      this.editWorkInstructionVideoUploaded = 2;
      this.editWorkInstructionVideo = file.name;
    },
    editWorkInstructionPhotoFileAdded: function () {
      this.editWorkInstructionPhotoUploaded = 1;
    },
    editWorkInstructionPhotoFileUploaded: function (file) {
      this.editWorkInstructionPhotoUploaded = 2;
      this.editWorkInstructionPhoto = file.name;
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
    // Work Order
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
    showInstructionsModal: function (videoUrl) {
      this.assInstructionsVideoSource = null;
      this.assInstructionsVideoSource = [
        {
          src: videoUrl,
          type: "video/mp4",
        },
      ];
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
<style src="./Dropdown.scss" lang="scss" />
<style src="./Dropzone.css" lang="css" />
<style src="./Multiselect.css" lang="css" />
