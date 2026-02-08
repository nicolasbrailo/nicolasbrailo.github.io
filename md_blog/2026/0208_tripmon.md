# Weekend project: Tripmon

@meta publishDate 2026-02-08
@meta author Nico Brailovsky

[Tripmon is a way to visualize my trips](https://github.com/nicolasbrailo/tripmon) (and daytrips).

![](https://raw.githubusercontent.com/nicolasbrailo/tripmon/refs/heads/main/README_screenshot2.jpg)

I have (had?) a lot of data in gmaps and no good way to visualize, or merge, with my extensive album collection. So I built a small service to categorize pictures and merge them with map traces. The service will also try to score the "best" pictures, for whatever definition of "best" a few ML models choose, and display just a few highlights for each part of the trip.

This project falls, for the most part, in [type 3 of my AI categorizaion](md_blog/2026/0118_AI.md): largely vibe-coded, and if it breaks I wouldn't know why. This is in contrast with other weekend projects; I also spent some time adding voice control to my home automation system. I "care" about the code in my home automation system, but I don't care much about the code of my Tripmon project. Adding new features to my home automation system takes 10x the time it takes to add new features to Tripmon, as I go through a very through review and refactor process. In my home automation service, when things break I know exactly why and how (it's fairly important for me to be able to turn my lights on or off). In Tripmon, if something doesn't work I just ask AI to iterate, until it more or less does what I want.

![](https://raw.githubusercontent.com/nicolasbrailo/tripmon/refs/heads/main/README_screenshot1.jpg)

From the readme, Tripmon will:

* Scan a directory for photo albums, and derive day-trips from album names.
* Group day-trips into trips, then generate a "report" for each trip.
* Merge each trip with GPS traces from G Maps.
* Run an analysis on your albums, and select the best N pictures (for whatever definition of "best" the model that looks at pictures may have)

With this information, Tripmon will generate a report for each trip and day-trip. The report will include

* A map overlay with the visited locations and the transport between each
* A list of places visited, and the time spent in each place
* A list of pictures to go with each place

