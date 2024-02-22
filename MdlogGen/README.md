# MdlogGen

// TODO

## Features
* Site search (using Github search - only logged in Github users can use it)
* Comments (kind of... they are actually PRs)
* Static and dynamic content
* RSS


## Format

* mlogen will process all md files in the specified prefix directory
* If the filename matches a path like 'prefix/YYYY/MM' (eg: 'site_md/2010/11_23_MyPost.md') it will be considered a post. This means it will be included in dynamic content (indexes, rss).
* Documents must start with a title ('# TITLE\n'). If a document doesn't start with a title, things will break (a blank title is acceptable: '#\n')
* Documents will be split in title, txt and (optionally) comments. Comments, if present, are identified by the string '# Comments'.
* Lines starting with '@meta' are metadata and alter the html generation process. They won't be included in the final document.
* Links between md files will be translated to links between generated html files.
    * All links must be relative, eg: [text](link/to/doc.md)
    * All external links must start with http or https
* Metadata will be available for replacement in templates as a key/value pair. For example, a line such as '@meta foo bar 123\n' will create a template key of 'foo' with value 'bar 123'.
* docType is an optional metadata key that informs the generator of the content. Default is 'post'. If 'notAPost' is used, the 'notAPost' template will be used. Similarly for 'index'.
* A few magic metadata values will be generated when parsing an md file:
    * anchorToTile: an html-friendly anchor name
    * commentCount: number of comments found
    * commentCountTxt: an md message with the number of comments and a link to the src md file
    * srcFile: (relative) path to source md file
    * htmlD: (relative) path to source md file
    * generatedDate: Time the md file was read
* If a metadata line is defined twice, the second definition will be ignored except for docType and extraNav; for docType and extraNav, the last definition will be picked up.


## Limitations

* Code blocks seem to fold '\n\n' into a single new line


