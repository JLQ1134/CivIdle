import classNames from "classnames";
import { Resource } from "../definitions/ResourceDefinitions";
import { Tick } from "../logic/TickLogic";
import { useTrades, useUser } from "../rpc/RPCClient";
import { L, t } from "../utilities/i18n";
import { AddTradeComponent } from "./AddTradeComponent";
import { FillPlayerTradeModal } from "./FillPlayerTradeModal";
import { showModal } from "./GlobalModal";
import { IBuildingComponentProps } from "./PlayerMapPage";

export function PlayerTradeComponent({ gameState, xy }: IBuildingComponentProps) {
   const trades = useTrades();
   const user = useUser();
   return (
      <fieldset>
         <legend>{t(L.PlayerTrade)}</legend>
         <AddTradeComponent gameState={gameState} xy={xy} />
         <div className="table-view">
            <table>
               <tbody>
                  <tr>
                     <th>{t(L.PlayerTradeWant)}</th>
                     <th>{t(L.PlayerTradeOffer)}</th>
                     <th>{t(L.PlayerTradeFrom)}</th>
                     <th></th>
                  </tr>
                  {trades.map((trade) => {
                     const disableFill = user == null || trade.fromId == user.userId;
                     return (
                        <tr key={trade.id}>
                           <td>
                              {Tick.current.resources[trade.buyResource as Resource].name()} x {trade.buyAmount}
                           </td>
                           <td>
                              {Tick.current.resources[trade.sellResource as Resource].name()} x {trade.sellAmount}
                           </td>
                           <td>{trade.from}</td>
                           <td>
                              <div
                                 className={classNames({
                                    "text-link": !disableFill,
                                    "text-strong": true,
                                    "text-desc": disableFill,
                                 })}
                                 onClick={() => {
                                    if (!disableFill) {
                                       showModal(<FillPlayerTradeModal trade={trade} />);
                                    }
                                 }}
                              >
                                 {t(L.PlayerTradeFill)}
                              </div>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </fieldset>
   );
}
