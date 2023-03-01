module hu.petrik.meetingtable.meetingtable {
    requires javafx.controls;
    requires javafx.fxml;


    opens hu.petrik.meetingtable.meetingtable to javafx.fxml;
    exports hu.petrik.meetingtable.meetingtable;
}