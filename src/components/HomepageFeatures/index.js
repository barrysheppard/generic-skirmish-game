import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Learn',
    Svg: require('@site/static/img/sword-brandish.svg').default,
    description: (
      <>
        The core rules are quick to teach and easy to learn.
      </>
    ),
  },
  {
    title: 'Quick to play',
    Svg: require('@site/static/img/fire-dash.svg').default,
    description: (
      <>
        The core design philosophy focuses on having a quick game. 
      </>
    ),
  },
  {
    title: 'Easy to customise',
    Svg: require('@site/static/img/erlenmeyer.svg').default,
    description: (
      <>
        New Fighters, Gear, and Abilities are easy to add.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg style={{ width: 100, height: 100 }} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
