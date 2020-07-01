$(function () {
    var graphDataUrl = "https://transaction-graph-viz.herokuapp.com/graph"
    //var graphDataUrl = "./graph"
    var graphDatas = []
    var toUsers = []
    var fromUsers = []

    var selectedGraph = null
    var selectedGraphIndex = null
    var filteredGraph = null

    var filterFrom = -1
    var filterTo = -1
    var filterAmount = -1

    //Inital method call
    getGraphData()

    //action methods
    $("#filter_button").click(function () {
        getFilters()
        $("#filter_clean_button").fadeIn()
    })

    $("#filter_clean_button").click(function () {
        cleanFilters()
    })

    $("#about-button").click(function () {
        $('#about-dialog').modal()
    })

    $("#contact-button").click(function () {
        $('#contact-dialog').modal()
    })

    function cleanFilters() {
        filteredGraph = null
        drawGrap()

        $("#filter_clean_button").fadeOut()

        $('#filter_from').val('-1'); // Select the option with a value of '1'
        $('#filter_from').trigger('change');

        $('#filter_to').val('-1'); // Select the option with a value of '1'
        $('#filter_to').trigger('change');

        $('#filter_transaction_amount').val("");
    }

    function getFilters() {
        
        var from = parseInt($('#filter_from').select2('data')[0].id)
        if (from != undefined && from != -1) { filterFrom = from } else { filterFrom = -1 }

        var to = parseInt($('#filter_to').select2('data')[0].id)
        if (to != undefined && to != -1) { filterTo = to } else { filterTo = -1 }

        amount = $("#filter_transaction_amount").val()
        if (amount != "") { filterAmount = amount } else { filterAmount = -1 }

        filterGraph()
    }

    function filterGraph() {
        filteredGraph = $.extend(true, {}, selectedGraph)

        if (filterFrom != -1) {
            filteredGraph.edges = filteredGraph.edges.filter(function (item) {
                return item.from == filterFrom
            })
        }

        if (filterTo != -1) {
            filteredGraph.edges = filteredGraph.edges.filter(function (item) {
                return item.to == filterTo
            })
        }

        if (filterAmount != -1) {
            filteredGraph.edges = filteredGraph.edges.filter(function (item) {
                return item.label == filterAmount
            })
        }

        
        filteredGraph.nodes = filteredGraph.nodes.filter(function (item) {
            return filteredGraph.edges.some(e => (e.from == item.id) || (e.to == item.id))
        })

        drawGrap()
    }

    $('#graphChoice').on('select2:select', function (e) {
        cleanFilters()
        var data = e.params.data;
        var graphId = data.id
        var graphIndex = graphDatas.findIndex(item => item.id == graphId)

        selectedGraph = graphDatas[graphIndex]
        selectedGraphIndex = graphIndex

        drawGrap()
    });


    // Graph Methods
    function displayGraph() {
        if (graphDatas.length > 1) {
            var graphChoices = graphDatas.map(function (item) {
                return { id: item.id, text: item.name }
            })

            $("#graphChoice").select2({
                data: graphChoices
            })

            $("#graphOption").fadeIn()
        }

        selectedGraph = graphDatas[0]
        selectedGraphIndex = 0

        drawGrap()
    }


    function drawGrap() {
        $("#graphTitle").html("<span style='font-weight: bold;'>Description: </span>" + selectedGraph.description + "  <br><span style='font-weight: bold;'>Date: </span>" + selectedGraph.date)
        
        var nodes = new vis.DataSet(filteredGraph != null ? filteredGraph.nodes : selectedGraph.nodes);
        var edges = new vis.DataSet(filteredGraph != null ? filteredGraph.edges : selectedGraph.edges);
        var container = document.getElementById('graphCanvas');

        var options = {
            autoResize: true,
            height: '100%',
            width: '100%',
            locale: 'en',
            physics: {
                forceAtlas2Based: {
                    gravitationalConstant: -26,
                    centralGravity: 0.005,
                    springLength: 230,
                    springConstant: 0.18
                },
                maxVelocity: 146,
                solver: 'forceAtlas2Based',
                timestep: 0.35,
                stabilization: { iterations: 150 }
            },

            nodes: {
                shape: "dot",
                size: 16,
                font: {
                    size: 18,

                },
                borderWidth: 2
            },

            edges: {
                width: 2,
                arrows: "to"
            }

        };

        var data = {
            nodes: nodes,
            edges: edges
        };

        var network = new vis.Network(container, data, options);
    }


    //service caller methods
    function getGraphData() {
        $.getJSON(graphDataUrl, {}, function (data) {
            graphDatas = data
            displayGraph()
            getFromUsers()
            getToUsers()
        });
    }

    function uniqueBy(arr, prop) {
        var tempArr = []

        arr.forEach(function (item) {

            if ((tempArr.filter(e => e[prop] == item[prop]).length == 0)) {
                tempArr.push(item)
            }
        })
        return tempArr
    }

    // User Methods
    function getUsers() {
        var allUsers = []
        graphDatas.forEach(function (data) {
            var users = data.nodes.map(function (node) {
                return { name: node.label, id: node.id }
            })

            allUsers = [].concat(allUsers, users)
        })

        return uniqueBy(allUsers, "name")
    }

    function getFromUsers() {
        var allFromUserIds = []
        graphDatas.forEach(function (data) {
            var fromUserIds = data.edges.map(function (edge) {
                return edge.from
            })
            allFromUserIds = [].concat(allFromUserIds, fromUserIds)
        })
        allFromUserIds = allFromUserIds.filter((v, i, a) => a.indexOf(v) === i);

        var users = getUsers()
        fromUsers = users.filter(function (user) {
            return allFromUserIds.includes(user.id)

            //SAME AS
            /*
                if(allFromUserIds.includes(user.id)) {
                    return true
                }else {
                    return false
                }
            */

        })


        var formattedFromUsers = fromUsers.map(function (item) {
            return { id: item.id, text: item.name }
        })

        formattedFromUsers.unshift({ text: "Choose", id: "-1" })

        $("#filter_from").select2({
            data: formattedFromUsers
        })

    }



    function getToUsers() {
        var allToUserIds = []
        graphDatas.forEach(function (data) {
            var toUserIds = data.edges.map(function (edge) {
                return edge.from
            })
            allToUserIds = [].concat(allToUserIds, toUserIds)
        })
        allToUserIds = allToUserIds.filter((v, i, a) => a.indexOf(v) === i);

        var users = getUsers()
        toUsers = users.filter(function (user) {
            return allToUserIds.includes(user.id)

            //SAME AS
            /*
                if(allFromUserIds.includes(user.id)) {
                    return true
                }else {
                    return false
                }
            */

        })

        var formattedToUsers = toUsers.map(function (item) {
            return { id: item.id, text: item.name }
        })

        formattedToUsers.unshift({ text: "Choose", id: "-1" })

        $("#filter_to").select2({
            data: formattedToUsers
        })
    }
});