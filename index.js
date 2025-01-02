import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.json.JSONObject;

import java.io.*;
import java.util.*;

public class AdvancedWikipediaParser {
    public static void main(String[] args) {
        try {
            String url = "https://en.wikipedia.org/wiki/Java_(programming_language)";
            Document doc = Jsoup.connect(url).get();

            // Parse content from the page
            String title = doc.title();
            String contentText = extractContent(doc);
            List<String> links = extractLinks(doc);
            List<String> images = extractImages(doc);
            
            // Store the data as JSON
            JSONObject jsonData = new JSONObject();
            jsonData.put("title", title);
            jsonData.put("content", contentText);
            jsonData.put("links", links);
            jsonData.put("images", images);
            
            // Write the JSON data to a file
            writeToJsonFile("output.json", jsonData);

            // Optionally: crawl linked pages
            crawlLinkedPages(links);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static String extractContent(Document doc) {
        Element content = doc.select(".mw-parser-output").first();
        return content.text();
    }

    private static List<String> extractLinks(Document doc) {
        List<String> links = new ArrayList<>();
        Elements linkElements = doc.select("a[href]");
        for (Element link : linkElements) {
            String href = link.attr("href");
            if (href.startsWith("/wiki/")) {
                links.add("https://en.wikipedia.org" + href);
            }
        }
        return links;
    }

    private static List<String> extractImages(Document doc) {
        List<String> images = new ArrayList<>();
        Elements imgElements = doc.select("img[src]");
        for (Element img : imgElements) {
            String src = img.attr("src");
            images.add("https:" + src);
        }
        return images;
    }

    private static void writeToJsonFile(String filename, JSONObject data) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filename))) {
            writer.write(data.toString(4)); // Pretty print with an indent factor of 4
            System.out.println("Data saved to " + filename);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void crawlLinkedPages(List<String> links) {
        for (String link : links) {
            try {
                Document doc = Jsoup.connect(link).get();
                System.out.println("Crawling: " + link);
                // You can extract and store additional data from each linked page here
            } catch (IOException e) {
                System.err.println("Failed to crawl link: " + link);
            }
        }
    }
}
