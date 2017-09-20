import { Injectable } from '@angular/core';

@Injectable()
export class PumpService {

  public _map = new Map([
    ["RWPS_LVL1","RWPS SUMP LEVEL-1"],
    ["RWPS_LVL2","RWPS SUMP LEVEL-2"],
    ["RWPS_FLW_1_CMN_DIS","RWPS COMMON DISCHARGE FLOW-1"],
    ["RWPS_FLW_2","RWPS COMMON DISCHARGE FLOW-1"],
    ["RWPS_FLW_TOTAL_1","RWPS COMMON DISCHARGE FLOW TOTALIZER-1"],
    ["RWPS_FLW_TOTAL_2","RWPS COMMON DISCHARGE FLOW TOTALIZER-2"],
    ["WTP_ZERO_POINT","WTP-ZERO POINT"],
    ["WTP_LVL_BKWS_TNK","WTP BACKWASH TANK LEVEL"],
    ["WTP_LVL_SLG_SMP","WTP SLUDGE SUMP LEVEL"],
    ["WTP_LVL_RCY_TNK","WTP RECYCLING TANK LEVEL"],
    ["WTP_LVL_SLG_THCK","WTP SLUDGE THICKNER LEVEL"],
    ["WTP_FLW_BKWS_TNK","WTP BACKWASH TANK FLOW"],
    ["WTP_FLW_INLT_INLT_CMB","WTP  INLET LINE INLET CHAMBER FLOW"],
    ["WTP_FLW_INLT_OTLT_CMB","WTP  OUTLET LINE INLET CHAMBER FLOW "],
    ["WTP_FLW_TOTAL_BKWS_TNK","WTP BACKWASH TANK FLOW TOTALIZER"],
    ["WTP_FLW_TOTAL_INLT_INLT_CMB","WTP INLET LINE INLET CHAMBER FLOW TOTALIZER"],
    ["WTP_FLW_TOTAL_INLT_OTLT_CMB","WTP OUTLET LINE INLET CHAMBER FLOW TOTALIZER"],
    ["CWPS_LVL","CWPS LEVEL"],
    ["CWPS_FLW_LSG","CWPS FLOW TOWARDS LALSAGAR"],
    ["CWPS_FLW_DGR","CWPS FLOW TOWARDS DIGARI"],
    ["CWPS_FLW_TOTAL_LSG","CWPS FLOW TOTALIZER TOWARDS LALSAGAR"],
    ["CWPS_FLW_TOTAL_DGR","CWPS FLOW TOTALIZER TOWARDS DIGARI"],
    ["LSG_LVL","LALSAGAR LEVEL"],
    ["LSG_FLW_CMN_DIS_CNP","LALSAGAR COMMON DISCHARGE FLOW TOWARDS CHAINPURA"],
    ["LSG_FLW_CMN_DIS_PNJ","LALSAGAR COMMON DISCHARGE FLOW TOWARDS PUNJLA"],
    ["LSG_FLW_CMN_DIS_NBR","LALSAGAR COMMON DISCHARGE FLOW TOWARDS NIRMAN BHAKRI"],
    ["LSG_FLW_TOTAL_CMN_DIS_CNP","LALSAGAR COMMON DISCHARGE FLOW TOTAL TOWARDS CHAINPURA"],
    ["LSG_FLW_TOTAL_CMN_DIS_PNJ","LALSAGAR COMMON DISCHARGE FLOW TOTAL TOWARDS PUNJLA"],
    ["LSG_FLW_TOTAL_CMN_DIS_NBR","LALSAGAR COMMON DISCHARGE FLOW TOTAL TOWARDS NIRMAN HAKRI"],
    ["LSG_FLW_CMN_DIS_RNG","LALSAGAR COMMON DISCHARGE FLOW TOWARDS RAJIV NAGAR"],
    ["LSG_FLW_CMN_DIS_MDC","LALSAGAR COMMON DISCHARGE FLOW TOWARDS MADERNA COLONY"],
    ["LSG_FLW_TOTAL_CMN_DIS_RNG","LALSAGAR COMMON DISCHARGE FLOW TOTAL TOWARDS RAJIV NAGAR"],
    ["LSG_FLW_TOTAL_CMN_DIS_MDC","LALSAGAR COMMON DISCHARGE FLOW TOTAL TOWARDS MADERNA COLONY"],
    ["LSG_FLW_CMN_DIS_IDC","LALSAGAR COMMON DISCHARGE FLOW TOWARDS INDIRA COLONY"],
    ["LSG_FLW_CMN_DIS_LSGR","LALSAGAR COMMON DISCHARGE FLOW TOWARDS LALSAGAR GSR"],
    ["LSG_FLW_TOTAL_CMN_DIS_IDC","LALSAGAR COMMON DISCHARGE FLOW TOTAL TOWARDS INDIRA COLONY"],
    ["LSG_FLW_TOTAL_CMN_DIS_LSGR","LALSAGAR COMMON DISCHARGE FLOW TOTAL TOWARDS LALSAGAR GSR"],
    ["VTC_Gandhinagar","VTC AT GANDHINAGAR"],
    ["VTC_DGR_1","VTC AT DIGARI-1"],
    ["VTC_DGR_2","VTC AT DIGARI-2"],
    ["VTC_DINDAYAL","VTC AT DINDAYAL"],
    ["VTC_KABIR_ASHRAM","VTC AT KABIR ASHRAM"],
    ["VTC_ZERO_POINT","VTC AT ZERO POINT"],
    ["VTC_RWPS","VTC AT RWPS"],
    ["RWPS_Pump1","RWPS PUMP-1"],
    ["RWPS_Pump2","RWPS PUMP-2"],
    ["RWPS_Pump3","RWPS PUMP-3"],
    ["RWPS_Pump4","RWPS PUMP-4"],
    ["RWPS_Pump5","RWPS PUMP-5"],
    ["RWPS_Pump6","RWPS PUMP-6"],
    ["RWPS_DW_Pump1","RWPS DEWATERING PUMP-1"],
    ["RWPS_DW_Pump2","RWPS DEWATERING PUMP-2"],
    ["CWPS_Pump1","CWPS DIGARI PUMP-1"],
    ["CWPS_Pump2","CWPS DIGARI PUMP-2"],
    ["CWPS_Pump3","CWPS LALSAGAR PUMP-1"],
    ["CWPS_Pump4","CWPS LALSAGAR PUMP-2"],
    ["CWPS_DW_Pump1","CWPS DEWATERING PUMP-1"],
    ["CWPS_DW_Pump2","CWPS DEWATERING PUMP-2"],
    ["LSG_Pump1","LALSAGAR PUMP-1"],
    ["LSG_Pump2","LALSAGAR PUMP-2"],
    ["LSG_Pump3","LALSAGAR PUMP-3"],
    ["LSG_Pump4","LALSAGAR PUMP-4"],
    ["LSG_Pump5","LALSAGAR PUMP-5"],
    ["LSG_Pump6","LALSAGAR PUMP-6"],
    ["LSG_Pump7","LALSAGAR PUMP-7"],
    ["LSG_Pump8","LALSAGAR PUMP-8"],
    ["LSG_Pump9","LALSAGAR PUMP-9"],
    ["LSG_Pump10","LALSAGAR PUMP-10"],
    ["LSG_Pump11","LALSAGAR PUMP-11"],
    ["LSG_Pump12","LALSAGAR PUMP-12"],
    ["LSG_Pump13","LALSAGAR PUMP-13"],
    ["LSG_Pump14","LALSAGAR PUMP-14"],
    ["LSG_DW_Pump1","LALSAGAR DEWATERING PUMP-1"],
    ["LSG_DW_Pump2","LALSAGAR DEWATERING PUMP-2"]

    ]);


	public mapUnit = new Map([
    ["RWPS_LVL1","mtr"],
    ["RWPS_LVL2","mtr"],
    ["RWPS_FLW_1_CMN_DIS","m<sup>3</sup>/hr"],
    ["RWPS_FLW_2","m<sup>3</sup>/hr"],
    ["RWPS_FLW_TOTAL_1","m<sup>3</sup>"],
    ["RWPS_FLW_TOTAL_2","m<sup>3</sup>"],
    ["WTP_ZERO_POINT","m<sup>3</sup>/hr"],
    ["WTP_LVL_BKWS_TNK","mtr"],
    ["WTP_LVL_SLG_SMP","mtr"],
    ["WTP_LVL_RCY_TNK","mtr"],
    ["WTP_LVL_SLG_THCK","mtr"],
    ["WTP_FLW_BKWS_TNK","m<sup>3</sup>/hr"],
    ["WTP_FLW_INLT_INLT_CMB","m<sup>3</sup>/hr"],
    ["WTP_FLW_INLT_OTLT_CMB","m<sup>3</sup>/hr"],
    ["WTP_FLW_TOTAL_BKWS_TNK","m<sup>3</sup>"],
    ["WTP_FLW_TOTAL_INLT_INLT_CMB","m<sup>3</sup>"],
    ["WTP_FLW_TOTAL_INLT_OTLT_CMB","m<sup>3</sup>"],
    ["CWPS_LVL","mtr"],
    ["CWPS_FLW_LSG","m<sup>3</sup>/hr"],
    ["CWPS_FLW_DGR","m<sup>3</sup>/hr"],
    ["CWPS_FLW_TOTAL_LSG","m<sup>3</sup>"],
    ["CWPS_FLW_TOTAL_DGR","m<sup>3</sup>"],
    ["LSG_LVL","mtr"],
    ["LSG_FLW_CMN_DIS_CNP","m<sup>3</sup>/hr"],
    ["LSG_FLW_CMN_DIS_PNJ","m<sup>3</sup>/hr"],
    ["LSG_FLW_CMN_DIS_NBR","m<sup>3</sup>/hr"],
    ["LSG_FLW_TOTAL_CMN_DIS_CNP","m<sup>3</sup>"],
    ["LSG_FLW_TOTAL_CMN_DIS_PNJ","m<sup>3</sup>"],
    ["LSG_FLW_TOTAL_CMN_DIS_NBR","m<sup>3</sup>"],
    ["LSG_FLW_CMN_DIS_RNG","m<sup>3</sup>/hr"],
    ["LSG_FLW_CMN_DIS_MDC","m<sup>3</sup>/hr"],
    ["LSG_FLW_TOTAL_CMN_DIS_RNG","m<sup>3</sup>"],
    ["LSG_FLW_TOTAL_CMN_DIS_MDC","m<sup>3</sup>"],
    ["LSG_FLW_CMN_DIS_IDC","m<sup>3</sup>/hr"],
    ["LSG_FLW_CMN_DIS_LSGR","m<sup>3</sup>/hr"],
    ["LSG_FLW_TOTAL_CMN_DIS_IDC","m<sup>3</sup>"],
    ["LSG_FLW_TOTAL_CMN_DIS_LSGR","m<sup>3</sup>"],
    ["VTC_Gandhinagar","m<sup>3</sup>/hr"],
    ["VTC_DGR_1","m<sup>3</sup>/hr"],
    ["VTC_DGR_2","m<sup>3</sup>/hr"],
    ["VTC_DINDAYAL","m<sup>3</sup>/hr"],
    ["VTC_KABIR_ASHRAM","m<sup>3</sup>/hr"],
    ["VTC_ZERO_POINT","m<sup>3</sup>/hr"],
    ["VTC_RWPS","m<sup>3</sup>/hr"],
    ["RWPS_Pump1",""],
    ["RWPS_Pump2",""],
    ["RWPS_Pump3",""],
    ["RWPS_Pump4",""],
    ["RWPS_Pump5",""],
    ["RWPS_Pump6",""],
    ["RWPS_DW_Pump1",""],
    ["RWPS_DW_Pump2",""],
    ["CWPS_Pump1",""],
    ["CWPS_Pump2",""],
    ["CWPS_Pump3",""],
    ["CWPS_Pump4",""],
    ["CWPS_DW_Pump1",""],
    ["CWPS_DW_Pump2",""],
    ["LSG_Pump1",""],
    ["LSG_Pump2",""],
    ["LSG_Pump3",""],
    ["LSG_Pump4",""],
    ["LSG_Pump5",""],
    ["LSG_Pump6",""],
    ["LSG_Pump7",""],
    ["LSG_Pump8",""],
    ["LSG_Pump9",""],
    ["LSG_Pump10",""],
    ["LSG_Pump11",""],
    ["LSG_Pump12",""],
    ["LSG_Pump13",""],
    ["LSG_Pump14",""],
    ["LSG_DW_Pump1",""],
    ["LSG_DW_Pump2",""]

  ]);


  constructor() {
    //console.log(this._map);
  }

  public get map():Map<string, string> {
    return this._map;
  }

  public set map(value:Map<string, string>) {
    this._map = value;
  }

  getPumpKeyDescription(key:string):any {
      return this._map.get(key)
  }

  getPumpKeyUnit(key:string):any {
    return this.mapUnit.get(key)
  }
}
