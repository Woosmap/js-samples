// [START woosmap_draw_shapes]
// Initialize and add the map
let map: woosmap.map.Map;
const modal = document.getElementById("modal") as HTMLElement;
const modalOverlay = document.getElementById("modal-overlay") as HTMLElement;
const modalContent = document.getElementById("modal-content") as HTMLElement;

function initMap() {
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      gestureHandling: "greedy",
      center: { lng: 3.878, lat: 43.611 },
      zoom: 15,
    },
  );

  const draw = new window.woosmap.map.Drawing({});

  draw.addControl(map);

  const getDrawDataBtn = document.getElementById(
    "getDrawData",
  ) as HTMLButtonElement;

  getDrawDataBtn.onclick = function () {
    // Retrieve geospatial data of all features
    const data = draw.getAll();
    if (modalContent && modal && modalOverlay) {
      modalContent.innerHTML =
        "<div><pre>" + JSON.stringify(data, null, 2) + "</pre></div>";
      modal.classList.toggle("closed");
      modalOverlay.classList.toggle("closed");
    }
  };

  // Once map is loaded, load features and update them
  window.woosmap.map.event.addListenerOnce(map, "idle", () => {
    const data: woosmap.map.GeoJSONFeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          id: "ce1e70483f88a26d67f0e8c4e7ab291d",
          type: "Feature",
          properties: { id: 178 },
          geometry: {
            coordinates: [
              [
                [
                  [3.87723568380971, 43.61004510654826],
                  [3.877173232470241, 43.609995174554946],
                  [3.875969990473409, 43.610782435129295],
                  [3.874992977309363, 43.61085322572703],
                  [3.87490330500336, 43.61085798523777],
                  [3.874920299074426, 43.61088783061132],
                  [3.875033981566216, 43.61100234133091],
                  [3.875239327484033, 43.61124839893764],
                  [3.875341755448687, 43.61128653729499],
                  [3.875821584563326, 43.61142547901778],
                  [3.876219401810511, 43.611657529015126],
                  [3.876386298388794, 43.61191381252446],
                  [3.876462591138587, 43.61204978911783],
                  [3.876688521594476, 43.61240317694387],
                  [3.876784226111961, 43.61269151565841],
                  [3.87750640474471, 43.61478302253694],
                  [3.878969292498894, 43.614721360039454],
                  [3.878991354795774, 43.61469515855401],
                  [3.879016399260738, 43.61438564622067],
                  [3.87903104532457, 43.61420271771747],
                  [3.879043225263142, 43.61400344760544],
                  [3.879054510454103, 43.61382225060507],
                  [3.879054976403675, 43.61366934805024],
                  [3.87906158624051, 43.61351748730524],
                  [3.879081333568947, 43.61336893515163],
                  [3.879094849170354, 43.61327738171909],
                  [3.879108728121874, 43.61318335712351],
                  [3.879124987325568, 43.613070177541346],
                  [3.879157112397478, 43.612964520846916],
                  [3.879160886153125, 43.6128207626612],
                  [3.879162158225039, 43.61277083084035],
                  [3.879154234983688, 43.61270684791956],
                  [3.879143605189804, 43.61262100759356],
                  [3.879124952275665, 43.612467973684154],
                  [3.879134221030735, 43.61225050944284],
                  [3.879113064979823, 43.61218707810722],
                  [3.87902265863165, 43.61177417785515],
                  [3.878809339808015, 43.611519934829225],
                  [3.878747630196757, 43.611470353999195],
                  [3.878689088812276, 43.611405749209446],
                  [3.87861409712047, 43.61131895270007],
                  [3.878559662935022, 43.61125121384044],
                  [3.878515859991845, 43.611198877724995],
                  [3.87844472117563, 43.61111658689222],
                  [3.878412335672631, 43.611075190317806],
                  [3.878389053636171, 43.611047373216195],
                  [3.878331737171745, 43.61100148914218],
                  [3.878203972501659, 43.610899208184684],
                  [3.878124528650318, 43.610843222312866],
                  [3.878032599276359, 43.61078399531407],
                  [3.877942436126883, 43.610725905749455],
                  [3.87788134852672, 43.610682311383755],
                  [3.877781501812151, 43.610611056281435],
                  [3.877674874976311, 43.6105039312038],
                  [3.877591622317234, 43.61042240627719],
                  [3.877527542608688, 43.61035965610335],
                  [3.877484346816363, 43.61031735676975],
                  [3.877448397940003, 43.61027439422253],
                  [3.877407172494655, 43.61022512689871],
                  [3.877347692882608, 43.61015980377995],
                  [3.877292798752846, 43.61009615418201],
                  [3.87723568380971, 43.61004510654826],
                ],
              ],
            ],
            type: "MultiPolygon",
          },
        },
        {
          id: "ced975631290bfb92fa88c88ad58bfd7",
          type: "Feature",
          properties: { id: 177 },
          geometry: {
            coordinates: [
              [
                [
                  [3.879312176871273, 43.608705900967976],
                  [3.879017817571605, 43.60855179214761],
                  [3.878846740945703, 43.60888455082224],
                  [3.878683407866292, 43.60900704391488],
                  [3.877173232470241, 43.609995174554946],
                  [3.87723568380971, 43.61004510654826],
                  [3.877292798752846, 43.61009615418201],
                  [3.877347692882608, 43.61015980377995],
                  [3.877407172494655, 43.61022512689871],
                  [3.877448397940003, 43.61027439422253],
                  [3.877484346816363, 43.61031735676975],
                  [3.877527542608688, 43.61035965610335],
                  [3.877591622317234, 43.61042240627719],
                  [3.877674874976311, 43.6105039312038],
                  [3.877781501812151, 43.610611056281435],
                  [3.87788134852672, 43.610682311383755],
                  [3.877942436126883, 43.610725905749455],
                  [3.878032599276359, 43.61078399531407],
                  [3.878124528650318, 43.610843222312866],
                  [3.878203972501659, 43.610899208184684],
                  [3.878331737171745, 43.61100148914218],
                  [3.878389053636171, 43.611047373216195],
                  [3.878412335672631, 43.611075190317806],
                  [3.87844472117563, 43.61111658689222],
                  [3.878515859991845, 43.611198877724995],
                  [3.878559662935022, 43.61125121384044],
                  [3.87861409712047, 43.61131895270007],
                  [3.878689088812276, 43.611405749209446],
                  [3.878747630196757, 43.611470353999195],
                  [3.878809339808015, 43.611519934829225],
                  [3.87902265863165, 43.61177417785515],
                  [3.879113064979823, 43.61218707810722],
                  [3.879134221030735, 43.61225050944284],
                  [3.879124952275665, 43.612467973684154],
                  [3.879143605189804, 43.61262100759356],
                  [3.879154234983688, 43.61270684791956],
                  [3.879162158225039, 43.61277083084035],
                  [3.879160886153125, 43.6128207626612],
                  [3.879157112397478, 43.612964520846916],
                  [3.879124987325568, 43.613070177541346],
                  [3.879108728121874, 43.61318335712351],
                  [3.879094849170354, 43.61327738171909],
                  [3.879081333568947, 43.61336893515163],
                  [3.87906158624051, 43.61351748730524],
                  [3.879054976403675, 43.61366934805024],
                  [3.879054510454103, 43.61382225060507],
                  [3.879043225263142, 43.61400344760544],
                  [3.87903104532457, 43.61420271771747],
                  [3.879016399260738, 43.61438564622067],
                  [3.878991354795774, 43.61469515855401],
                  [3.879127095045209, 43.61453395317722],
                  [3.879560123827636, 43.614508369370306],
                  [3.879995689101646, 43.614340955707846],
                  [3.880318938546543, 43.61405268537611],
                  [3.880364562030231, 43.61392996343038],
                  [3.880663998137896, 43.613619369525786],
                  [3.881156556674401, 43.613380136588596],
                  [3.880861132786423, 43.6118954566386],
                  [3.880349135556878, 43.609639620452505],
                  [3.880303709594752, 43.60943964407529],
                  [3.880254774306703, 43.609223680143465],
                  [3.880239055898081, 43.60915468468103],
                  [3.879989335488736, 43.609110255539775],
                  [3.879312176871273, 43.608705900967976],
                ],
              ],
            ],
            type: "MultiPolygon",
          },
        },
        {
          id: "3e87c3c4b1187a961d81f4bb3c601c87",
          type: "Feature",
          properties: { id: 171 },
          geometry: {
            coordinates: [
              [
                [
                  [3.877173232470241, 43.609995174554946],
                  [3.876997150650149, 43.60983191419888],
                  [3.877050116749197, 43.6096945450035],
                  [3.877129533389764, 43.609621021755764],
                  [3.877231493743239, 43.60955084918098],
                  [3.877185223459408, 43.60947158726262],
                  [3.877129049725028, 43.60937861724765],
                  [3.877085902980458, 43.60930989133323],
                  [3.876974852475874, 43.60927655825716],
                  [3.876857244544899, 43.60924125607631],
                  [3.876747936508712, 43.60914624100758],
                  [3.876673483547143, 43.60906959621776],
                  [3.876628691974402, 43.60902511569549],
                  [3.87656525886382, 43.60905776824647],
                  [3.876519221044608, 43.60900303883027],
                  [3.87637868344895, 43.608842177787245],
                  [3.876281546896803, 43.60873584691156],
                  [3.876189540277445, 43.60863512999356],
                  [3.876097362797569, 43.608536745829994],
                  [3.876069901233031, 43.60850659275627],
                  [3.874976410383615, 43.608792928726096],
                  [3.874797352728805, 43.60923790200079],
                  [3.874703150167254, 43.60948201613925],
                  [3.87466866897494, 43.609473580681815],
                  [3.87461382993484, 43.60947910608173],
                  [3.874514675182836, 43.60952864220464],
                  [3.874318072313684, 43.60962686361148],
                  [3.874206318317659, 43.60968269431958],
                  [3.874102380188829, 43.60973629166609],
                  [3.874045065404444, 43.609766046482925],
                  [3.873960818979251, 43.60983259935665],
                  [3.873895687258876, 43.60992023612062],
                  [3.873841058354826, 43.60999374122293],
                  [3.873784326934977, 43.610076380234666],
                  [3.873724961680268, 43.610196369645315],
                  [3.873672429805673, 43.61030254486445],
                  [3.873645340922923, 43.61033424663648],
                  [3.873222967992572, 43.61013941001228],
                  [3.873057057309061, 43.6103128526449],
                  [3.8729744673597, 43.6104138457633],
                  [3.872915164114727, 43.610547160657724],
                  [3.872802301999507, 43.61094706419028],
                  [3.872803950054148, 43.61101127420438],
                  [3.873209196261226, 43.61099036315352],
                  [3.874822069303863, 43.610862296131266],
                  [3.874992977309363, 43.61085322572703],
                  [3.875969990473409, 43.610782435129295],
                  [3.877173232470241, 43.609995174554946],
                ],
              ],
            ],
            type: "MultiPolygon",
          },
        },
        {
          id: "e0cba1d21cd487432667deb2c186d8f0",
          type: "Feature",
          properties: { id: 185 },
          geometry: {
            coordinates: [
              [
                [
                  [3.876069901233031, 43.60850659275627],
                  [3.876031087626782, 43.608461269272055],
                  [3.876610585577108, 43.608280331151605],
                  [3.876533605725728, 43.60816505565283],
                  [3.876491123578433, 43.60810292532245],
                  [3.876457725896571, 43.60805408049688],
                  [3.876424971745748, 43.60800617798765],
                  [3.876321895716133, 43.607903464726405],
                  [3.876197984657741, 43.60777672941059],
                  [3.876104736264267, 43.607681353970506],
                  [3.876003465537458, 43.60767295982343],
                  [3.87591580159451, 43.6076656940594],
                  [3.875891914566628, 43.60734783217764],
                  [3.875882774107663, 43.6071820062646],
                  [3.875857284233864, 43.60706404959097],
                  [3.875948929121996, 43.60702755817515],
                  [3.876034974791444, 43.60699329569463],
                  [3.876161582673605, 43.6069428826979],
                  [3.876182520183385, 43.60693136439971],
                  [3.876126373341322, 43.60686745814223],
                  [3.875975454656613, 43.60665977007602],
                  [3.874266435207055, 43.60738109462226],
                  [3.873066783816702, 43.60858038076977],
                  [3.873572707546969, 43.60880169105729],
                  [3.873155809883326, 43.60921274856619],
                  [3.872961433435711, 43.6095140220199],
                  [3.872848273967118, 43.609962601055074],
                  [3.873222967992572, 43.61013941001228],
                  [3.873645340922923, 43.61033424663648],
                  [3.873672429805673, 43.61030254486445],
                  [3.873724961680268, 43.610196369645315],
                  [3.873784326934977, 43.610076380234666],
                  [3.873841058354826, 43.60999374122293],
                  [3.873895687258876, 43.60992023612062],
                  [3.873960818979251, 43.60983259935665],
                  [3.874045065404444, 43.609766046482925],
                  [3.874102380188829, 43.60973629166609],
                  [3.874206318317659, 43.60968269431958],
                  [3.874318072313684, 43.60962686361148],
                  [3.874514675182836, 43.60952864220464],
                  [3.87461382993484, 43.60947910608173],
                  [3.87466866897494, 43.609473580681815],
                  [3.874703150167254, 43.60948201613925],
                  [3.874797352728805, 43.60923790200079],
                  [3.874976410383615, 43.608792928726096],
                  [3.876069901233031, 43.60850659275627],
                ],
              ],
            ],
            type: "MultiPolygon",
          },
        },
        {
          id: "79a6b8e170997cd4061f06a8d5e12b0c",
          type: "Feature",
          properties: { id: 246 },
          geometry: {
            coordinates: [
              [
                [
                  [3.877173232470241, 43.609995174554946],
                  [3.878683407866292, 43.60900704391488],
                  [3.878846740945703, 43.60888455082224],
                  [3.879017817571605, 43.60855179214761],
                  [3.879312176871273, 43.608705900967976],
                  [3.879989335488736, 43.609110255539775],
                  [3.880239055898081, 43.60915468468103],
                  [3.880193684107213, 43.60895681708215],
                  [3.880067009335697, 43.60833875173631],
                  [3.880151430583759, 43.6081592340998],
                  [3.880840149432663, 43.607190133065444],
                  [3.880759503309227, 43.607056550092885],
                  [3.879982785817643, 43.606335160821516],
                  [3.87953727445772, 43.60650741997801],
                  [3.87873465838038, 43.606818281663536],
                  [3.878291335928515, 43.60698484821721],
                  [3.878049265027079, 43.606754828195136],
                  [3.877908545852379, 43.606612695283545],
                  [3.877705559286433, 43.60642914781408],
                  [3.877530984458207, 43.606308019849145],
                  [3.877395432573245, 43.60617219825704],
                  [3.875975454656613, 43.60665977007602],
                  [3.876126373341322, 43.60686745814223],
                  [3.876182520183385, 43.60693136439971],
                  [3.876161582673605, 43.6069428826979],
                  [3.876034974791444, 43.60699329569463],
                  [3.875948929121996, 43.60702755817515],
                  [3.875857284233864, 43.60706404959097],
                  [3.875882774107663, 43.6071820062646],
                  [3.875891914566628, 43.60734783217764],
                  [3.87591580159451, 43.6076656940594],
                  [3.876003465537458, 43.60767295982343],
                  [3.876104736264267, 43.607681353970506],
                  [3.876197984657741, 43.60777672941059],
                  [3.876321895716133, 43.607903464726405],
                  [3.876424971745748, 43.60800617798765],
                  [3.876457725896571, 43.60805408049688],
                  [3.876491123578433, 43.60810292532245],
                  [3.876533605725728, 43.60816505565283],
                  [3.876610585577108, 43.608280331151605],
                  [3.876031087626782, 43.608461269272055],
                  [3.876069901233031, 43.60850659275627],
                  [3.876097362797569, 43.608536745829994],
                  [3.876189540277445, 43.60863512999356],
                  [3.876281546896803, 43.60873584691156],
                  [3.87637868344895, 43.608842177787245],
                  [3.876519221044608, 43.60900303883027],
                  [3.87656525886382, 43.60905776824647],
                  [3.876628691974402, 43.60902511569549],
                  [3.876673483547143, 43.60906959621776],
                  [3.876747936508712, 43.60914624100758],
                  [3.876857244544899, 43.60924125607631],
                  [3.876974852475874, 43.60927655825716],
                  [3.877085902980458, 43.60930989133323],
                  [3.877129049725028, 43.60937861724765],
                  [3.877185223459408, 43.60947158726262],
                  [3.877231493743239, 43.60955084918098],
                  [3.877129533389764, 43.609621021755764],
                  [3.877050116749197, 43.6096945450035],
                  [3.876997150650149, 43.60983191419888],
                  [3.877173232470241, 43.609995174554946],
                ],
              ],
            ],
            type: "MultiPolygon",
          },
        },
        {
          id: "5ab83a82f30bd6858aa74602ce840f19",
          type: "Feature",
          properties: { id: 233 },
          geometry: {
            coordinates: [
              [
                [
                  [3.875341755448687, 43.61128653729499],
                  [3.875239327484033, 43.61124839893764],
                  [3.875033981566216, 43.61100234133091],
                  [3.874920299074426, 43.61088783061132],
                  [3.87490330500336, 43.61085798523777],
                  [3.874822069303863, 43.610862296131266],
                  [3.873209196261226, 43.61099036315352],
                  [3.873225611393057, 43.61108678074377],
                  [3.87326833066067, 43.61136317888197],
                  [3.873335403208082, 43.61165303350734],
                  [3.873355934682227, 43.61190975806902],
                  [3.873004591189578, 43.61200946991577],
                  [3.872585322490421, 43.612238671159695],
                  [3.872805320334245, 43.612452322003605],
                  [3.872931732807786, 43.612459472571345],
                  [3.87304160024692, 43.61260638919806],
                  [3.873159930499318, 43.61287177731367],
                  [3.874678501737307, 43.61259798931923],
                  [3.874275514607108, 43.61343058827385],
                  [3.874129758812439, 43.613816027549895],
                  [3.874132264269231, 43.61394372081845],
                  [3.874165288352175, 43.614113764658306],
                  [3.874229998770734, 43.614371717847],
                  [3.874395274306113, 43.6148663211975],
                  [3.87449359679246, 43.615347201874705],
                  [3.877189710654439, 43.614845280132485],
                  [3.87750640474471, 43.61478302253694],
                  [3.876784226111961, 43.61269151565841],
                  [3.876688521594476, 43.61240317694387],
                  [3.876462591138587, 43.61204978911783],
                  [3.876386298388794, 43.61191381252446],
                  [3.876219401810511, 43.611657529015126],
                  [3.875821584563326, 43.61142547901778],
                  [3.875341755448687, 43.61128653729499],
                ],
              ],
            ],
            type: "MultiPolygon",
          },
        },
        {
          id: "dfc8c641e87cd48b97939d010de6395a",
          type: "Feature",
          properties: { id: 100 },
          geometry: {
            coordinates: [3.877974459824543, 43.611837785588364],
            type: "Point",
          },
        },
        {
          id: "a0efae8eb31dd14bffc2ba1a54da78b5",
          type: "Feature",
          properties: { id: 78 },
          geometry: {
            coordinates: [3.8755129613801387, 43.6125188439413],
            type: "Point",
          },
        },
        {
          id: "42b3ae5bea7e35b77d83df84db50890e",
          type: "Feature",
          properties: { id: 32 },
          geometry: {
            coordinates: [3.8752174361028153, 43.60961568759575],
            type: "Point",
          },
        },
        {
          id: "ccd1c214208c1ef15ec58db3d0316560",
          type: "Feature",
          properties: { id: 59 },
          geometry: {
            coordinates: [3.8791097645197965, 43.61042881638582],
            type: "Point",
          },
        },
        {
          id: "90419ac282ba6254076aa44057d1021a",
          type: "Feature",
          properties: { id: 82 },
          geometry: {
            coordinates: [3.8777989585810246, 43.60817074575451],
            type: "Point",
          },
        },
        {
          id: "06020c733bdcf366b36cffb8ebb78d2b",
          type: "Feature",
          properties: { id: 38 },
          geometry: {
            coordinates: [3.8744622703561618, 43.6081876705768],
            type: "Point",
          },
        },
      ],
    };

    // draw.add() method allows you to load features on the map.
    draw.add(data);
  });
  modalOverlay.onclick = function () {
    modal.classList.toggle("closed");
    modalOverlay.classList.toggle("closed");
  };
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_draw_shapes]

export {};
