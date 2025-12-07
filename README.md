# MUS205-Final-Project
An interactive Christmas scene where users can explore and interact with various houses in the town. Clicking on a house transports the user into an animated living room filled with interactive Christmas elements.

---------------------------------------------------------------------------------------------------------------------------------------

First Draft: So far we have the interactive image for our first scene where when you click on the door it'll bring you to the next scene -- the living room. We accomplished this by making a color detecting function where when your mouse is over the specific brown of the door (which we edited the image to ensure the doors would be a solid brown color unique to the doors) and click, it'll move you to the next scene.

In addition we added clouds to the scene and we are currently implementing a 'click-to-snow' feature to the clouds.
Accomplished through adding a Cloud class.

We have also started to add our audio files which we will implement soon.

As for the living room, we had to manually re-size and extend the image as it wasn't horrizontal enough so we did that manually by drawing in the background on a third party app.

---------------------------------------------------------------------------------------------------------------------------------------

🔹 1. Ideation Phase
How did the idea emerge?
We got the idea to do a Christmas Scenary Project as the holiday seasons were coming up and wanted to do a festive interactive scene.
Each interactive idea came from thinking about the elements present in the scene and how we can make it more interactive. For example, we knew that to complete a Christmas scene, we would need a christmas tree so we thought of how we can make that interactive and we settled on decorating it with ornaments. In addition, we wanted to add sound interactivity so we wanted a radio that you can play music from. And we just kept coming up with more things to add. 

What artistic/technical goals guided your early thinking?
Since many of us in this group are begginer coders, we also stuck with ideas that were within our skill sets (things we've done in class before that we knew we can replicate). This is also why we settled on the 2 scenes thing, boucing off the idea of the interactive storytelling class we had. Then we also took skills from the making-an-image-interactive class to get the idea to detect the door for us to enter to the next scene rather than just clicking 1 or 2. Also the particle effects for our own effects. 

3. Coding & Development Phase
Each member of the group should briefly speak about:

Your personal contribution to the project

Your experience working collaboratively

Any specific functions, classes, or features you worked on

What aspects of the code 

worked exactly as you hoped

didn’t work at first, and how you solved or re-designed them

Renee: I created the github repository for everyone to work on and taught the groupmates that were new to this how to use github. I also created the skeleton of the project, creating the initial town scene which would lead you to the living room when you click a door. I helped find the town image and resize/edit the living room image so it would fit a horizontal display nicely. I also helped source some of the images and audio files. I created the function for the mouse to detetct what color the cursor was hovering over so that we can use that to detect where the doors on the image were so that you can click on them and have it bring you to the next scene. For the town scene I also added the twinkling star effect in the background. As for audio, I added the bg music to the town scene. I also modified the door opening sound effect to match more with the visual and the twinkle sound effect to the tree when you placed an ornament. I also just did a bunch of cleanup and small modifications to other team members code to ensure everything was polished. This was my second time working on a github repo with many people and the experience was overall pretty smooth. I was able to see changes and addition to the code that others added and was able to tinker with it. Some specific functions/classes I worked on was detectColor(), displayCurrentPage(), Class star, townText(). The code that works exactly as I'd hope was the detetcColor() function as initially I was nervous on how we would be able to change the scene, so the idea to detect the door color came up as there was 2 doors on the town scene and they were both the same color and that color only appeared on the door. In addition I was proud of the star Class which I think helps bring our image of the christmas town to life. The door actually didnt work initially so I had to go in and edit the doors so they'd be one solid color. In addition the audio didn't work at first, so then I added the feature where you need to click to get the audio started and that helped it.


