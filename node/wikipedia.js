import Promise from 'bluebird';
import wiki from 'wikijs'
import _ from 'lodash'

export default class Wikipedia {

  analyze(text){
    text = text.toLowerCase();
    let textArr = text.split(' ');
    textArr = _.map(textArr, word=> word = word.replace(/[,\.\)\(]/, ''));
    let words = {};
    _.each(textArr, function(word){
      if (word.length < 5) { return; }
      return words[word] = _.isNil(words[word]) ? 0 : words[word] + 1;
    });
    words = _.map(words, (value, key)=>
      ({
        name: key,
        rank: value
      })
    );
    words = _.omit(words, ['this', 'that', 'south', 'north', 'east', 'west',
    'southern', 'northen', 'between', 'after', 'before', 'then', 'there', 'here',
    'against', 'their', 'other', 'where', 'which', 'should', 'areas', 'within',
    'standard', 'service', 'cited', 'including', 'using', 'these', 'mainly',
    'which', 'years', 'century', 'under', 'after', 'become']);
    return words;
  }

  best(dict, count) {
    if (isNaN(count)) {
      count = 10;
    }
    return _.chain(dict).sortBy('rank').reverse().take(count).value();
  }

  keywords(text) {
    const words = this.analyze(text);
    const ranks = this.best(words, 20);
    return _.map(ranks, 'name').join(', ');
  }

  async bestArticle(scrapedArticles) {
    const foundArticle = _.maxBy(scrapedArticles, (article) => {
        return article?.images?.length || 0;
    });
    if (_.isEmpty(foundArticle?.images) || foundArticle.images.length < 5) {
        return null;
    }
    return foundArticle;
  }

  async randomEn() {
    const articles = await wiki.default().random(10);
    const scrapedArticles = await Promise.mapSeries(_.compact(articles), (a) => this.scrape(a))
    const article = await this.bestArticle(scrapedArticles);
    if (!article) {
        await Promise.delay(5000)
        return this.randomEn()
    }
    return article
  }

  async scrape(articleTitle) {
      try {
          const article = await wiki.default().page(articleTitle);
          const text = await article.summary();
          const cleanedText = this.cleanText(text);
          const keywords = `${articleTitle}, ${this.keywords(cleanedText)}`;
          const description =  _.take(cleanedText.split('. '), 3).join('. ');
          const images = await this.getImages(article);
          const source = await article.url()
          const wikipedia = await article.url()
          const title = articleTitle;
          return {
              name:title,
              source,
              title,
              images,
              text: cleanedText,
              keywords,
              description,
              wikipedia
          };
      } catch(e) {
          if (e.type != 'invalid-json') {
              console.error(e);
          }
          return null;
      }
  }

  async getImages(article) {
      if (!article) {
          console.warn('No article sent to getImages');
          return [];
      }
      const res = await article.rawImages().then((images) => {
          return _.compact(_.map(images, (image) => {
              if (!image.title) {
                  return null;
              }
              const name = _.last(image.title.split(':'));
              const ext = _.last(name.split('.')).toLowerCase();
              // if (!_.includes(['jpg', 'png', 'jpeg'], ext)) {
              if (!_.includes(['jpg', 'jpeg'], ext)) {
                  return null;
              }
              const url = image.imageinfo[0].url;
              return { name, url };
          }));
      });
      return res;
  }

  cleanText(text) {
      // Removing [1] reference numbers -- not needed anymore
      // text = text.replace(/\[\d+\]/g, '');
      text = text.replace(/\.([A-Z])/g, '. $1');
      // Remove all text in ( )
      text = text.replace(/\(.*?\)/g, '');
      // text = text.replace('[citation needed]', '');
      // text = text.replace('[clarification needed]', '');
      // text = text.replace('[clarification needed],', '');
      return text
  }
};
