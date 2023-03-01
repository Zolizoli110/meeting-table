package hu.petrik.meetingtable.meetingtable;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;

public class MeetingTableApplication extends Application {
    private static final int APPLICATION_WIDTH = 320;
    private static final int APPLICATION_HEIGHT = 240;
    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(HelloApplication.class.getResource("hello-view.fxml"));
        Scene scene = new Scene(fxmlLoader.load(), APPLICATION_WIDTH, APPLICATION_HEIGHT);
        stage.setTitle("Meeting Table");
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch();
    }
}