<template>
  <div class="visits-page">
    <div
      v-if="role == 'Administrator' || role == 'Manager'"
      class="manager-page"
    >
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
              variant="success"
              size="sm"
              v-on:click="showAddWorkOrderModal()"
              >Add New</b-button
            >
          </div>
          <div class="clearfix pt-2 pb-2">
            <p>Display All Available Works</p>
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
                  <td>{{ row.work_id }}</td>
                  <td>
                    <img
                      class="img-rounded"
                      :src="
                        require(`../../assets/tables/${(row.id % 5) + 1}.jpg`)
                      "
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
              label-for="addWorkOrderId"
              invalid-feedback="Input Item ID"
            >
              <b-form-input
                id="addWorkOrderId"
                type="text"
                v-model="addWorkOrderId"
                trim
              ></b-form-input>
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
                      :src="
                        require(`../../assets/tables/${(row.id % 5) + 1}.jpg`)
                      "
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
            <b-button variant="warning" class="float-right" size="sm" v-on:click="showMaterialsModal()"
              >Materials</b-button
            >
            <b-button variant="default" class="mr-3 float-right" size="sm" v-on:click="showStackingModal()"
              >Stacking</b-button
            >
            <b-button variant="dark" class="mr-3 float-right" size="sm" v-on:click="showInstructionsModal()"
              >Instructions</b-button
            >
          </div>
        </b-col>
      </b-row>
      <b-modal id="instructions-modal" size="lg" centered title="Instructions">
        <div style="width: 100%; height: 400px" class="d-flex justify-content-center align-items-center">
          <p>This modal will be explaining how to assemble the item.</p>
        </div>
        <template #modal-footer="{ cancel }">
          <b-button size="sm" variant="default" @click="cancel()">
            Close
          </b-button>
        </template>
      </b-modal>
      <b-modal id="stacking-modal" size="lg" centered title="Stacking">
        <div style="width: 100%; height: 400px" class="d-flex justify-content-center align-items-center">
          <p>Stacking Placeholder</p>
        </div>
        <template #modal-footer="{ cancel }">
          <b-button size="sm" variant="default" @click="cancel()">
            Close
          </b-button>
        </template>
      </b-modal>
      <b-modal id="materials-modal" size="lg" centered title="Materials">
        <div style="width: 100%; height: 400px" class="d-flex justify-content-center align-items-center">
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

export default {
  name: "ManagerDashboard",
  sockets: {
    connect: function () {
    },
    fetchData: function (data) {
      let helper = {};
      this.addWorkOrderStation = null;
      this.mngWorkOrderList = data.mngWorkOrderList;
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
  },
  data() {
    return {
      userid: 0,
      name: "",
      username: "",
      email: "",
      role: "",
      stationName: "",

      mngWorkOrderList: [],
      mngWorkOrderListByStation: [],
      mngStationList: [],
      mngStationDropdownOptions: [],
      mngBuiltCount: 0,

      addWorkOrderId: "",
      addWorkOrderQuantity: "",
      addWorkOrderStation: null,
      addStationName: "",

      assWorkOrderList: [],
      assSubWorkOrderList: [],
      assSubWorkOrderInProgress: {},
    };
  },
  methods: {
    showAddWorkOrderModal: function () {
      this.addWorkOrderId = "";
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
          work_id: this.addWorkOrderId,
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

<style src="./Visits.scss" lang="scss" />
<style src="./multiselect.css" lang="css" />
