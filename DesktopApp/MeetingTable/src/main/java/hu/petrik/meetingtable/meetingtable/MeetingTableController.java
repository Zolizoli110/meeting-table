package hu.petrik.meetingtable.meetingtable;

import javafx.fxml.FXML;
import javafx.scene.control.Label;

public class MeetingTableController {
    @FXML
    private Label welcomeText;

    @FXML
    protected void onWelcomeButtonClick() {
        welcomeText.setText("Welcome to Meeting Table !");
    }
}