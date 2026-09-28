import "./styles.css";
import { Animator } from "./ui/animator";
import { byId, wireOverlays } from "./ui/dom";
import { GalleryView } from "./ui/gallery";
import { openHistory } from "./ui/history-view";
import { TableView } from "./ui/table";
import { ZoomView } from "./ui/zoom";

const animator = new Animator();
const zoom = new ZoomView(animator);
const gallery = new GalleryView(animator, zoom);
const table = new TableView(animator, zoom, localStorage);

wireOverlays();
byId("galleryBtn").onclick = () => gallery.open();
byId("historyBtn").onclick = () => openHistory(localStorage);

table.render();
animator.start();
