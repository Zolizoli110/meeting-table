Start the application:  
`npm run start`
- this will create and start the docker container
- then starts the server
  
To stop the application container:  
`npm run stop`  
- first it stops the container
- then removes it
  
Run E2E tests:  
`npm run test:e2e`  
- first it creates the test container
- fills it with the test data if it exists
- then runs the test

To stop the test container:  
`npm run stop:test`  
- first it stops the container
- then removes it
