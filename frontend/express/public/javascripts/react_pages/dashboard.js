var Dashboard = React.createClass({

    topbar_height : 110,

    mixins: [UpdatePageMixin, TimeRangeMixin],

    getInitialState: function() {

        var top_items_bars = this.make_top_items_bars();       
        
        var map_metrics = this.make_map_metrics();
             
        return {
            "date_period" : false,
            "top_items_bars" : top_items_bars,
            "inited" : false,
            "long_text_flag" : false,
            "language" : false,
            "map_metric" : map_metrics[0],
            "map_metrics" : map_metrics,
            "map_radio_button" : 0
        }

    },
    
    make_tabs : function(){

        var sessionData = countlySession.getSessionData();

        var tabs = [
        {
              "title":jQuery.i18n.map["common.total-sessions"],
              "data":sessionData.usage['total-sessions'],
              "id":"draw-total-sessions",
              "help":"dashboard.total-sessions",
              "data_function" : this.__getSessionDPTotal, // data function for line chart
              "data_item" : "total-sessions"
        },
        {
              "title":jQuery.i18n.map["common.total-users"],
              "data":sessionData.usage['total-users'],
              "id":"draw-total-users",
              "help":"dashboard.total-users",
              "data_function" : this.__getUserDPActive, // data function for line chart
              "data_item" : "total-users"
        },
        {
              "title":jQuery.i18n.map["common.new-users"],
              "data":sessionData.usage['new-users'],
              "id":"draw-new-users",
              "help":"dashboard.new-users",
              "data_function" : this.__getUserDPNew, // data function for line chart
              "data_item" : "new-users"
        },
        {
              "title":jQuery.i18n.map["dashboard.time-spent"],
              "data":sessionData.usage['total-duration'],
              "id":"draw-total-time-spent",
              "help":"dashboard.total-time-spent",
              "data_function" : this.__getDurationDP, // data function for line chart
              "data_item" : "total-duration"
        },
        {
              "title":jQuery.i18n.map["dashboard.avg-time-spent"],
              "data":sessionData.usage['avg-duration-per-session'],
              "id":"draw-time-spent",
              "help":"dashboard.avg-time-spent2",
              "data_function" : this.__getDurationDPAvg, // data function for line chart
              "data_item" : "avg-duration-per-session"
        },
        {
              "title":jQuery.i18n.map["dashboard.avg-reqs-received"],
              "data":sessionData.usage['avg-events'],
              "id":"draw-avg-events-served",
              "help":"dashboard.avg-reqs-received",
              "data_function" : this.__getEventsDPAvg, // data function for line chart
              "data_item" : "avg-events"
        }];

        return tabs;

    },
    
    make_map_metrics : function(){
        
        var map_metrics = [
            {
                "id" : 0,           
                "label":jQuery.i18n.map["common.total-sessions"],      
                "title":jQuery.i18n.map["common.total-sessions"],                  
                "metric": "t",
                "type": "number",                
                "color" : "#1B8AF3"
            },
            {   
                "id" : 1,
                "label":jQuery.i18n.map["common.total-users"], 
                "title":jQuery.i18n.map["common.total-users"],                    
                "metric" : "u",
                "color" : "#1B8AF3",
                "type": "number",                
            },
            {
                "id" : 2,
                "label":jQuery.i18n.map["common.new-users"],    
                "title":jQuery.i18n.map["common.new-users"],                               
                "metric" : "n",
                "color" : "#1B8AF3",
                "type": "number",                                
            }
        ];
        
        return map_metrics;
        
    },    

    make_top_items_bars : function(){
        
        /*
            Settings of horizontal bar chart
        */

        var top_items_bars = [
            {
                "title":jQuery.i18n.map["common.bar.top-platform"],
                "data_function":countlyDeviceDetails.getPlatformBars,
                "help":"dashboard.top-platforms"
            },
            {
                "title":jQuery.i18n.map["common.bar.top-resolution"],
                "data_function":countlyDeviceDetails.getResolutionBars,
                "help":"dashboard.top-resolutions"
            },
            {
                "title":jQuery.i18n.map["common.bar.top-carrier"],
                "data_function":countlyCarrier.getCarrierBars,
                "help":"dashboard.top-carriers"
            },
            {
                "title":jQuery.i18n.map["common.bar.top-users"],
                "data_function":countlySession.getTopUserBars,
                "help":"dashboard.top-users"
            }
        ];
        
        return top_items_bars;
            
    },
        
    __getSessionDPTotal : function(){                          
        return this.GetTimeRanges(countlySession.getSessionDPTotal);          
    },
    
    __getUserDPActive : function(){                          
        return this.GetTimeRanges(countlySession.getUserDPActive);          
    },
    
    __getUserDPNew : function(){                          
        return this.GetTimeRanges(countlySession.getUserDPNew);          
    },
    
    __getDurationDP : function(){    
        return this.GetTimeRanges(countlySession.getDurationDP);          
    },
    
    __getDurationDPAvg : function(){                          
        return this.GetTimeRanges(countlySession.getDurationDPAvg);          
    },
    
    __getEventsDPAvg : function(){
        return this.GetTimeRanges(countlySession.getEventsDPAvg); 
    },

    init_data : function(timestamp) {

        var self = this;

        $.when(countlyUser.initialize(), countlyCarrier.initialize(), countlyDeviceDetails.initialize()).then(function () {

            var graph_tabs = self.make_tabs();

            self.setState({
                "graph_tabs" : graph_tabs,
                "active_top_tab" : self.state.active_top_tab ? self.state.active_top_tab : 0,
                "tabs_data_function" : self.state.tabs_data_function ? self.state.tabs_data_function : countlySession.getSessionData, // data function for tabs data
                "graph_data_function" : self.state.graph_data_function ? self.state.graph_data_function : graph_tabs[0].data_function, // data function for line chart
                "inited" : true
            })
        });
    },

    componentWillReceiveProps: function(nextProps) {

        var state_obj = {
            "date_period" : nextProps.date,
            "language" : nextProps.language,
        }

        if (this.state.language != nextProps.language)
        {
            state_obj.graph_tabs = this.make_tabs();
            
            state_obj.top_items_bars = this.make_top_items_bars();       
        
            state_obj.map_metrics = this.make_map_metrics(); 
        }
        
        /*if (nextProps.date != this.props.date) // todo
        {*/
            this.setState(state_obj);
        //}
    },

    top_tab_click : function(i, tab) {

        if (i == this.state.active_top_tab)
        {
            return true;
        }

        this.setState({
            "active_top_tab" : i,
            "graph_data_function" : tab.data_function
        })

    },

    is_long_text : function(height, id)
    {

        if (height > 14) // todo: var
        {
            this.setState({
                long_text_flag : true
            })
        }
    },
    
    radio_button_click : function(id)
    {

        if (id == this.state.map_radio_button){
            return true;
        }

        var metric = this.state.map_metrics[id];

        this.setState({
            map_radio_button : id,
            map_metric : metric
        });

    },

    render : function(){
        
        var self = this;

        if (!this.state.inited)
        {
            return (<Loader/>);
        }

        var elements_width = get_viewport_width();

        var graph_width = elements_width - 40; // todo
        var map_width = elements_width - 260;
        var map_height = 560;

        var dashboard_style = {
            "width" : elements_width
        }

        var top_tab_style = {
            "width" : elements_width/*+ 1*/ /* +1 because of relative -1px left position, need for hide left border if tab is active */
        }

        var tab_item_style = {
            "width" : Math.round(top_tab_style.width / this.state.graph_tabs.length)
        }

        var last_tab_width_difference = top_tab_style.width - (tab_item_style.width * this.state.graph_tabs.length);

        var labels_mapping = {
            "t" : jQuery.i18n.map["common.total-users"],
            "n" : jQuery.i18n.map["common.new-users"],
        }

        var lines_descriptions = [
            {
                "label" : "Current Time Range"
            },
            {
                "label" : "Previous Time Range"
            }            
        ]

        if (this.state.long_text_flag)
        {
            top_tab_style.height = (this.topbar_height + 15) + "px"
        }
        else
        {
            top_tab_style.height = this.topbar_height + "px"
        }

        return (
            <div id="dashboard" style={dashboard_style}>

                <div className="top_tabs" style={top_tab_style}>
                {

                    _.map(this.state.graph_tabs, function(tab, id) {

                        var tabs_data = self.state.tabs_data_function(); // todo: !!! no need to call this function in loop

                        var data = tabs_data.usage[tab.data_item]; // todo: !!! tabs_data.usage[tab.data_item] = tab.usage

                        //var total = tab.data.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); ;

                        //var data = tab.data;

                        var total = data.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                        var class_name = "tab";

                        if (id == self.state.active_top_tab)
                        {
                            class_name += " active";
                        }

                        if (data.trend == "u")
                        {
                            var trend_class_name = "trend up";
                            var percent_change = "+ " + data.change;
                        }
                        else
                        {
                            var trend_class_name = "trend down";
                            var percent_change = /*"- " + */data.change;
                        }

                        var title = tab.title.toUpperCase();

                        //var text_width = self.getTextWidth(title, text_check_style); // toto: non-english languages will have another font-family

                        if (id == self.state.graph_tabs.length - 1)
                        {
                            var style = {
                                width : tab_item_style.width + last_tab_width_difference
                            }
                        }
                        else
                        {
                            var style = tab_item_style;
                        }

                        if (self.state.long_text_flag)
                        {
                            style.height = (self.topbar_height + 15) + "px";
                        }
                        else
                        {
                            style.height = (self.topbar_height) + "px"
                        }

                        return (
                            <div onClick={self.top_tab_click.bind(self, id, tab)} className={class_name} style={style}>
                                <div className={"total"}>
                                    {total}
                                </div>
                                <div className={trend_class_name}>
                                    {percent_change}
                                </div>
                                <div className={"title"}>
                                    <MultiLangLabel
                                        label={title}
                                        onHeightChange={self.is_long_text}
                                        id={id}
                                    />
                                </div>
                            </div>)
                    })
                }
                </div>

                <LineChart 
                    trend_sign={false}
                    width={elements_width}
                    height={260}
                    sides_padding={20}
                    graph_width={elements_width}
                    period={countlyCommon.getPeriod()}
                    big_numbers={false}
                    with_granularity={true}
                    data_function={this.state.graph_data_function}
                    update_graph_function={countlyCommon.updateTimeGraph}
                    lines_descriptions={lines_descriptions}
                    reverse_dp={true}
                    language={this.props.language}
                />

                <DateSign
                    sign={"most frequent"}
                />

                <DashboardBarChart
                    width={graph_width}
                    height={300}
                    data_function={false}
                    labels_mapping={labels_mapping}
                    graph_label={"DEVICES DISTRIBUTION"}
                    label_key={"device"}
                    data={this.state.top_items_bars}
                    language={this.props.language}
                />

                <DateSign
                    sign={"countries"}
                />

                <DashboardMap
                    width={map_width}
                    height={map_height}
                    data={this.state.top_items_bars}
                    metric={this.state.map_metric}
                />
                
                <div className="radio_buttons_container">
                {
                    _.map(self.state.map_metrics, function(radio_button, i) {

                        return <RadioButton
                                  id={i}
                                  data={radio_button}
                                  on_click={self.radio_button_click.bind(self, i)}
                                  current_button_id={self.state.map_radio_button}
                                  />
                    })
                }

                </div>

            </div>
        );

        /*
        <div className="live_block">

            <div className="bar_block first">
                <div className="sign">LIVE: TOTAL USERS</div>
                <div className="bar_rect">
                    <div className="bar-outer">
                    <div className="bar-inner" style={style}>
                      <span className="bar-inner-text">2,348</span>
                    </div>
                    <span className="bar-outer-text">2,348</span>
                    </div>
                </div>
                <div className="max">
                    <span>MAX</span><span className="count">2,429</span>
                </div>
            </div>

            <div className="bar_block second">
                <div className="sign">LIVE: NEW USERS</div>
                <div className="bar_rect">
                    <div className="bar-outer">
                    <div className="bar-inner" style={style}>
                      <span className="bar-inner-text">1,225</span>
                    </div>
                    <span className="bar-outer-text">1,225</span>
                    </div>
                </div>
                <div className="max">
                    <span>MAX</span><span className="count">1,923</span>
                </div>
            </div>

        </div>
        */
    },    
    
});