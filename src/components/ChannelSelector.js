import React, { Component } from 'react'
import './../css/ChannelSelector.css';
import BlueToothCommands from './../shared/BlueToothCommands';

export class ChannelSelector extends Component {

    updateChannel = async (e) => {
        if(this.props.state.channelState.editedChannelDescription !== null){
            let id = this.props.state.channelState.editedChannelDescription.id;
            let numLEDs = (this.props.state.channelState.editedChannelDescription.numLEDs !== null) ? this.props.state.channelState.editedChannelDescription.numLEDs : this.props.state.channelState.channelDescriptions[id].numLEDs
            let type = (this.props.state.channelState.editedChannelDescription.type !== null) ? this.props.state.channelState.editedChannelDescription.type : this.props.state.channelState.channelDescriptions[id].type
            let order = (this.props.state.channelState.editedChannelDescription.order !== null) ? this.props.state.channelState.editedChannelDescription.order : this.props.state.channelState.channelDescriptions[id].order
            let position = (this.props.state.channelState.editedChannelDescription.position !== null) ? this.props.state.channelState.editedChannelDescription.position : this.props.state.channelState.channelDescriptions[id].position
            let used = this.props.state.channelState.selectedChannelList[id];
            let status = await BlueToothCommands.updateChannel(
                this.props.state.deviceState.selectedDevice,
                id,
                type,
                numLEDs,
                this.getIntFromPosition(position),
                order,
                used
            );

            if(status){
                let channelDescriptions = this.props.state.channelState.channelDescriptions;
                channelDescriptions[id].numLEDs = numLEDs;
                channelDescriptions[id].type = type;
                channelDescriptions[id].order = order;
                channelDescriptions[id].position = position;
                this.props.stateUpdaters.updateChannelState(
                    this.props.state.channelState.selectedChannelList,
                    channelDescriptions,
                    {   
                        id: id,
                        type: null,
                        numLEDs: null,
                        position: null,
                        order: null
                    }
                );
            }
        }else{
            //there is nothing to update
        }
    }

    getIntFromPosition = (position) => {
        let intPosition = 0;
        let splitPosition = position.split(":");
        intPosition = parseInt(splitPosition[0]) * 4
        intPosition += parseInt(splitPosition[1]);
        return intPosition;
    }

    channelClicked = (e) => {
        let currentSelectedChannelList = this.props.state.channelState.selectedChannelList;
        currentSelectedChannelList[e.target.value] = (currentSelectedChannelList[e.target.value] === true) ? false : true
        this.props.stateUpdaters.updateChannelState(
            currentSelectedChannelList,
            this.props.state.channelState.channelDescriptions,
            this.props.state.channelState.editedChannelDescription
        );
    }

    getDisabledStatus = (channelNum) => {
        if(this.props.state.channelState.channelDescriptions !== null){
            if(this.props.state.channelState.channelDescriptions[channelNum].stripType === 0){
                return true;
            }else if(this.props.state.channelState.channelDescriptions[channelNum].stripType === null){
                return true;
            }else{
                return false;
            }
        }
        return true;
    }

    getToggleStyle = (channel) => {
        let currentSelectedChannelList = this.props.state.channelState.selectedChannelList;
        let channelFound = currentSelectedChannelList[channel];
        if(channelFound){
            return "channelButtonSelected"
        }else{
            return "channelButton"
        }
    }

    getTogglePositionStyle = (value) => {
        if(this.props.state.channelState.editedChannelDescription != null){
            let id = this.props.state.channelState.editedChannelDescription.id;
            let position = this.props.state.channelState.editedChannelDescription.position;
            if(position !== null){
                if(value === position){
                    return "channelPositionSelectedUsed";
                }else{
                    return "channelPosition";
                }
            }else if(this.props.state.channelState.channelDescriptions !== null
                && value === this.props.state.channelState.channelDescriptions[id].position){
                return "channelPositionSelectedUsed";
            }else{
                return "channelPosition";
            }
        }else{
           return "channelPosition";
        }
    }

    switchEditingChannel = (e) => {
        this.props.stateUpdaters.updateChannelState(
            this.props.state.channelState.selectedChannelList,
            this.props.state.channelState.channelDescriptions,
            {
                id: parseInt(e.target.value),
                type: null,
                numLEDs: null,
                position: null,
                order: null
            }
        );
    }

    updateChannelPosition = (e) => {
        if(this.props.state.channelState.editedChannelDescription !== null){
            let editedChannelDescription = this.props.state.channelState.editedChannelDescription;
            editedChannelDescription.position = e.target.value;
            this.props.stateUpdaters.updateChannelState(
                this.props.state.channelState.selectedChannelList,
                this.props.state.channelState.channelDescriptions,
                editedChannelDescription
            );
        }
    }

    updateStripType = (e) => {
        if(this.props.state.channelState.editedChannelDescription !== null){
            let editedChannelDescription = this.props.state.channelState.editedChannelDescription;
            editedChannelDescription.type = parseInt(e.target.value);
            this.props.stateUpdaters.updateChannelState(
                this.props.state.channelState.selectedChannelList,
                this.props.state.channelState.channelDescriptions,
                editedChannelDescription
            );
        }
    }

    updateNumLEDs = (e) => {
        if(this.props.state.channelState.editedChannelDescription !== null){
            let editedChannelDescription = this.props.state.channelState.editedChannelDescription;
            editedChannelDescription.numLEDs = parseInt(e.target.value);
            this.props.stateUpdaters.updateChannelState(
                this.props.state.channelState.selectedChannelList,
                this.props.state.channelState.channelDescriptions,
                editedChannelDescription
            );
        }
    }

    updateColorOrder = (e) => {
        if(this.props.state.channelState.editedChannelDescription !== null){
            let editedChannelDescription = this.props.state.channelState.editedChannelDescription;
            editedChannelDescription.order = parseInt(e.target.value);
            this.props.stateUpdaters.updateChannelState(
                this.props.state.channelState.selectedChannelList,
                this.props.state.channelState.channelDescriptions,
                editedChannelDescription
            );
        }
    }

    addEditChannels = () => {
        let editedChannelDescription = null;
        if(this.props.state.channelState.editedChannelDescription === null){
            editedChannelDescription = {
                id: 0,
                type: null,
                numLEDs: null,
                position: null,
                order: null
            }
        }
        this.props.stateUpdaters.updateChannelState(
            this.props.state.channelState.selectedChannelList,
            this.props.state.channelState.channelDescriptions,
            editedChannelDescription
        );
    }

    getNumLEDsValue = () => {
        if(this.props.state.channelState.editedChannelDescription !== null){
            let id = this.props.state.channelState.editedChannelDescription.id;
            let numLEDs = this.props.state.channelState.editedChannelDescription.numLEDs;
            if(numLEDs !== null){
                return numLEDs
            }else if(this.props.state.channelState.channelDescriptions !== null
                && this.props.state.channelState.channelDescriptions[id].numLEDs !== null){
                return this.props.state.channelState.channelDescriptions[id].numLEDs
            }else{
                return 0;
            }
        }else{
            return 0;
        }
    }

    getSelectedChannel = () => {
        if(this.props.state.channelState.editedChannelDescription !== null){
            return this.props.state.channelState.editedChannelDescription.id;
        }else{
            return 0;
        }
    }

    getSelectedColorOrder = () => {
        if(this.props.state.channelState.editedChannelDescription !== null){
            let id = this.props.state.channelState.editedChannelDescription.id;
            let order = this.props.state.channelState.editedChannelDescription.order;
            if(order !== null){
                return order
            }else if(this.props.state.channelState.channelDescriptions !== null
                && this.props.state.channelState.channelDescriptions[id].order !== null){
                return this.props.state.channelState.channelDescriptions[id].order
            }else{
                return 0;
            }
        }else{
            return 0;
        }
    }

    getSelectedStripType = () => {
        if(this.props.state.channelState.editedChannelDescription !== null){
            let id = this.props.state.channelState.editedChannelDescription.id;
            let type = this.props.state.channelState.editedChannelDescription.type;
            if(type !== null){
                return type
            }else if(this.props.state.channelState.channelDescriptions !== null
                && this.props.state.channelState.channelDescriptions[id].type !== null){
                return this.props.state.channelState.channelDescriptions[id].type
            }else{
                return 0;
            }
        }else{
            return 0;
        }
    }

    showAddEditDescription = () => {
        if(this.props.state.channelState.editedChannelDescription !== null){
            return <React.Fragment>
                <div className="channelAddEditDiv">
                    <div>
                        <label>Channel:
                            <select className="channelInput" onChange={this.switchEditingChannel} value={this.getSelectedChannel()}>
                                <option value={0}>0</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label>LED Count:<input className="channelInput" type="text" name="numLEDs" value={this.getNumLEDsValue()} maxLength="3" onChange={this.updateNumLEDs}/></label>
                    </div>
                    <div>
                        <label>Color Order:
                            <select className="channelInput" value={this.getSelectedColorOrder()} onChange={this.updateColorOrder}>
                                <option value={0}>RGB</option>
                                <option value={1}>RBG</option>
                                <option value={2}>BRG</option>
                                <option value={3}>BGR</option>
                                <option value={4}>GBR</option>
                                <option value={5}>GRB</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label>Strip Type:
                            <select className="channelInput" value={this.getSelectedStripType()} onChange={this.updateStripType}>
                                <option value={0}>NONE</option>
                                <option value={1}>NEO KHZ800 (WS2812)</option>
                                <option value={2}>NEO KHZ400 (WS2811)</option>
                            </select>
                        </label>
                    </div>
                    <div className="channelPositionDiv" >
                        <label>Strip Position:
                            <div>
                                <input className={this.getTogglePositionStyle("0:0")} type="button" value="0:0" onClick={this.updateChannelPosition}/>
                                <input className={this.getTogglePositionStyle("0:1")} type="button" value="0:1" onClick={this.updateChannelPosition}/>
                                <input className={this.getTogglePositionStyle("0:2")} type="button" value="0:2" onClick={this.updateChannelPosition}/>
                            </div>  
                            <div>
                                <input className={this.getTogglePositionStyle("1:0")} type="button" value="1:0" onClick={this.updateChannelPosition}/>
                                <input className={this.getTogglePositionStyle("1:1")} type="button" value="1:1" onClick={this.updateChannelPosition}/>
                                <input className={this.getTogglePositionStyle("1:2")} type="button" value="1:2" onClick={this.updateChannelPosition}/>
                            </div>  
                            <div>
                                <input className={this.getTogglePositionStyle("2:0")} type="button" value="2:0" onClick={this.updateChannelPosition}/>
                                <input className={this.getTogglePositionStyle("2:1")} type="button" value="2:1" onClick={this.updateChannelPosition}/>
                                <input className={this.getTogglePositionStyle("2:2")} type="button" value="2:2" onClick={this.updateChannelPosition}/>
                            </div>  
                            <div>
                                <input className={this.getTogglePositionStyle("3:0")} type="button" value="3:0" onClick={this.updateChannelPosition}/>
                                <input className={this.getTogglePositionStyle("3:1")} type="button" value="3:1" onClick={this.updateChannelPosition}/>
                                <input className={this.getTogglePositionStyle("3:2")} type="button" value="3:2" onClick={this.updateChannelPosition}/>
                            </div>  

                        </label>
                    </div>
                    <div>
                        <input className="channelButton channelInput" type="button" value="Update Channel" onClick={this.updateChannel}/>
                    </div>
                </div>
            </React.Fragment>
        }
    }

    render() {
        return (
            <div className="channelSelectorMainDiv">
                <h3>Select Channels</h3>
                <div className="channelsDiv">
                    <input className="channelButton channelInput" type="button" name="addEditChannels" value="Add/Edit Channels" onClick={this.addEditChannels}/>
                    {this.showAddEditDescription()}
                    <div>
                        <input disabled={this.getDisabledStatus(0)} className={this.getToggleStyle(0)} type="button" name="channel0" value={0} onClick={this.channelClicked}/>
                        <input disabled={this.getDisabledStatus(1)} className={this.getToggleStyle(1)} type="button" name="channel1" value={1} onClick={this.channelClicked}/>
                        <input disabled={this.getDisabledStatus(2)} className={this.getToggleStyle(2)} type="button" name="channel2" value={2} onClick={this.channelClicked}/>
                        <input disabled={this.getDisabledStatus(3)} className={this.getToggleStyle(3)} type="button" name="channel3" value={3} onClick={this.channelClicked}/>
                        <input disabled={this.getDisabledStatus(4)} className={this.getToggleStyle(4)} type="button" name="channel4" value={4} onClick={this.channelClicked}/>
                        <input disabled={this.getDisabledStatus(5)} className={this.getToggleStyle(5)} type="button" name="channel5" value={5} onClick={this.channelClicked}/>
                        <input disabled={this.getDisabledStatus(6)} className={this.getToggleStyle(6)} type="button" name="channel6" value={6} onClick={this.channelClicked}/>
                        <input disabled={this.getDisabledStatus(7)} className={this.getToggleStyle(7)} type="button" name="channel7" value={7} onClick={this.channelClicked}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChannelSelector