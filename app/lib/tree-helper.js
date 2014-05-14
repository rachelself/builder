'use strict';

function getClass(height)
{
  if(height === 0){
    return 'seed';
  }

  if(height <= 12){
    return 'sapling';
  }

  if(height <= 48){
    return 'treenager';
  }

  return 'adult';
}

exports.getClass = getClass;
// we're exporting the function getClass
// on import this function shoved in an object
