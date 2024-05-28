import { Way, WayOptions, WaysJsonEntity } from '../entities/ways-json-entity';
import { WaysJsonNotFountError, buildTemplate, getCurrentDir, getWaysJson } from '../services/file-service';
import { logError, logJson, logSubtitle, logTitle } from '../services/log-service';

export async function buildCommand() {
  logTitle('Build project');
  logSubtitle('Read ways.json file');
  let waysJson: WaysJsonEntity;
  try {
    waysJson = await getWaysJson();
  } catch (error) {
    return handleWaysJsonReadError(error);
  }
  for (const way of waysJson) {
    buildWay(way);
  }
}

function handleWaysJsonReadError(error: unknown) {
  if (error instanceof WaysJsonNotFountError) {
    logError('Project is not initialized. Run `ways init` command to initialize it.');
  } else {
    logError('An unexpected error occurred while reading ways.json file.');
  }
}

function buildWay(way: Way) {
  for (const template of way.templates) {
    buildWayTemplate(template, way);
  }
}

function buildWayTemplate(template: string, way: Way) {
  logSubtitle(`Build template: ${template}`);
  for (const options of way.options) {
    buildWayOptions(template, options);
  }
}

function buildWayOptions(template: string, options: WayOptions) {
  logJson('Options', options);
  buildTemplate({
    template,
    destiny: getCurrentDir(),
    options,
  })
}
