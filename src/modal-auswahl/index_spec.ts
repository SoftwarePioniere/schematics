import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';


// SchematicTestRunner needs an absolute path to the collection to test.
const collectionPath = path.join(__dirname, '../collection.json');


describe('modal-auswahl', () => {
  it('requires required option', () => {
    // We test that
    const runner = new SchematicTestRunner('schematics', collectionPath);
    expect(() => runner.runSchematic('modal-auswahl', {}, Tree.empty())).toThrow();
  });
});
