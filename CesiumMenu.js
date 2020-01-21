class Menu{
    constructor(viewer, mode){
        
        this.viewer = viewer;
        var that = this;
        var wind_gui;
        var fly_gui;
        var snow_gui;
        var rain_gui;
        var cloud_gui;
        var flow_gui;
        var flow;
        var op = function(){
            this.ShowFly = function(){
                requirejs(['fly'],function(){
                    var flyModel = new Fly(viewer);
                    flyModel.initFly();
                    $("#flyOptionId").fadeIn();
                    var option1 = function(){
                        this.StartFly = function(){flyModel.startFly();}
                        this.PouseFly = function(){
                            flyModel.pauseFly();
                        }
                        this.Tracked = function(){
                            flyModel.aircraftView();
                        }
                        this.FlyBack = function(){flyModel.flyBack();};
                        this.FlyForward = function(){flyModel.flyForward();}
                        this.CustomFly = function(){flyModel.customFly();}
                        this.stopFly = function(clear){flyModel.stopFly(clear);}
                    };
                    var options1 = new option1();
                    $("#startfly").click(options1.StartFly);
                    $("#pouse").click(options1.PouseFly);
                    $("#tracked").click(options1.Tracked);
                    $("#back").click(options1.FlyBack);
                    $("#foward").click(options1.FlyForward);
                    $("#custom").click(options1.CustomFly);
                    $("#closeId2").click(function(){
                        $("#flyOptionId").fadeOut();
                        options1.stopFly(true);
                        viewer.camera.flyHome();
                        // viewer.entities.removeAll();
                    })

                 });
            };
            this.ShowWind = function(){
                var box = new dat.GUI({ autoPlace: false });
                $("#windId").fadeIn();
                viewer.camera.flyTo({
                    destination : Cesium.Cartesian3.fromDegrees(120, 32.71, 10000000.0)});
                var panel = new Panel(viewer,box);
                var wind3D = new Wind3D(
                    panel,
                    mode,
                    viewer);
                var panelContainer = document.getElementsByClassName('cesium-viewer').item(0);
                box.domElement.classList.add('myPanel');
                panelContainer.appendChild(box.domElement);

                $("#closewind").click(function(){
                    panelContainer.removeChild(box.domElement);
                    box.domElement.classList.remove('myPanel');
                    $("#windId").fadeOut();
                    wind3D.removePrimitives();
                    viewer.camera.flyHome();
                })
                
                box.open();
            };
            this.ShowSnow = function(){
                $("#snowId").fadeIn();
                requirejs(['snow'], function(snow){
                    var psnow = snow.init(viewer);
                    $("#closesnow").click(function(){
                        $("#snowId").fadeOut();
                        snow.destroy(viewer,psnow);
                        viewer.camera.flyHome();
                    })
                });
                // viewer.scene.globe.depthTestAgainstTerrain = true;
                that.resetCameraFunction();
                
            };
            this.ShowRain = function(){
                $("#rainId").fadeIn();
                requirejs(['rain'], function(rain){
                    var prain= rain.init(viewer);
                    $("#closerain").click(function(){
                        $("#rainId").fadeOut();
                        rain.destroy(viewer,prain);
                        viewer.camera.flyHome();
                    })
                });
                
                that.resetCameraFunction();
            };
            this.ShowCloud = function(){
                
                requirejs(['cloud'], function(cloud){
                    cloud.init(viewer);
                });
            };
            this.ShowFlow = function(){
                $("#flowId").fadeIn();
                flow = new LineCharts(viewer);
                $("#closeFlow").click(function(){
                    $("#flowId").fadeOut();
                    flow.destroy();
                });
            };
            this.ShowHeat = function(){
                $("#heatId").fadeIn();
                let bounds = {
                    west: 110,
                    east: 130,
                    south: 10,
                    north: 30
                }
                let heatMap = CesiumHeatmap.create(
                    viewer,
                    bounds,
                    {
                        maxopacity: 0.9
                    })
                let data = [];
                for(var i = 0;i<1000;i++){
                    data.push({"x": bounds.west+Math.random()*(bounds.east-bounds.west),"y": bounds.south+Math.random()*(bounds.north-bounds.south),"value": Math.round(Math.random()*100)});
                }
                let valueMin = 0;
                let valueMax = 100;
                heatMap.setWGS84Data(valueMin, valueMax, data);
                console.log(viewer.entities);
                $("#closeheat").click(function(){
                    $("#heatId").fadeOut();
                    viewer.entities.removeAll();
                    viewer.camera.flyHome();
                })
                
                let rectangle = Cesium.Rectangle.fromDegrees(bounds.west, bounds.south, bounds.east, bounds.north);
                viewer.camera.flyTo({
                    destination: rectangle
                });
            }
            this.ShowTemp = function(){
                requirejs(['temputureMain'],function(){
                    new temputureMain(viewer);
                })
            }
        }
        var opts = new op();
        $('#rain').click(opts.ShowRain);
        $('#snow').click(opts.ShowSnow);
        $('#heat').click(opts.ShowHeat);
        $('#wind').click(opts.ShowWind);
        $('#flyId').click(opts.ShowFly);
        $("#flow").click(opts.ShowFlow);
        $("#temp").click(opts.ShowTemp);
        // $('#temp').click()
        
        
        let viewModel = {
            startLat: 0,//left
            endLat: 10,//right
            startLon: 0,//button
            endLon: 10,//up
            change: function(){
                $("#fileToUpload").trigger('click');
                
            }
        };
        Cesium.knockout.track(viewModel);
        var toolbar = document.getElementById('toolbar');
        Cesium.knockout.applyBindings(viewModel, toolbar);
        Cesium.knockout.getObservable(viewModel, 'startLat');
        Cesium.knockout.getObservable(viewModel, 'endLat');
        Cesium.knockout.getObservable(viewModel, 'startLon');
        Cesium.knockout.getObservable(viewModel, 'endLon');
        
        $("#fileToUpload").change(function(e){
            var f = e.currentTarget.files[0];
            var lat1 = viewModel.startLat;
            var lon1 = viewModel.startLon;
            var lat2 = viewModel.endLat;
            var lon2 = viewModel.endLon;
            var layers = viewer.scene.imageryLayers;
            layers.addImageryProvider(new Cesium.SingleTileImageryProvider({
                url : './data/'+f.name,
                rectangle : Cesium.Rectangle.fromDegrees(lat1, lon1, lat2, lon2)
            }));
        })
        
    }

    resetCameraFunction(){
        this.viewer.scene.camera.setView({
            destination : new Cesium.Cartesian3(277096.634865404, 5647834.481964232, 2985563.7039122293),
            orientation : {
                heading : 4.731089976107251,
                pitch : -0.32003481981370063
            }
        });
    }
}