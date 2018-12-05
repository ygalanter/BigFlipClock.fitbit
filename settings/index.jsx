function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Big Flip Clock Settings</Text>}>
      
        <Select
          label={`Time digit animation`}
          settingsKey="timeDigitanimation"
          options={[
            {name:"Disable Always", value:"0"},
            {name:"Disable on Screen wakeup", value:"1"},
            {name:"Enable always", value:"2"}
          ]}
        />
        
        
      </Section>
      
       
       <Section title={<Text bold align="center">Donate!</Text>}>
      
      <Text italic>If you like this clockface and would like to see it further developed as well as other wonderful Fitbit apps and faces created, please know - I run on coffee. It's an essential fuel for inspiration and creativity. So feel free to tap the link below to donate so I won't run out of fuel :) Thanks!
         </Text>
      
      <Link source="https://paypal.me/yuriygalanter">YURIY'S COFFEE FUND</Link> 
         
         </Section>   
      
      
    </Page>
  );
}

registerSettingsPage(mySettings);