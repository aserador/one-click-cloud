import React, { ReactNode, use, useCallback, useRef, useState } from 'react';
import {
  HomeIcon,
  ChevronDownIcon,
  TextBoxIcon,
  ForwardSlash,
  DebugIcon,
  ClockIcon,
  ZoomOut,
  ZoomIn,
  FitView,
} from '../icons';
import { Viewport, useOnViewportChange, useReactFlow } from 'reactflow';
import { store } from '@/redux/store';
import { getZoomLevel, setZoomLevel } from '@/redux/viewportSlice';
import { useSelector } from 'react-redux';

function setButtonStyle(activeButtonId: string, isActive: boolean) {
  const button = document.getElementById(activeButtonId);
  if (!button) {
    return;
  }
  if (isActive) {
    button.classList.add('toolbar-button-active');
  } else {
    button.classList.remove('toolbar-button-active');
  }
}

interface ToolbarButtonProps {
  buttonName: string;
  width?: string;
  onButtonClick: (buttonName: string) => void;
  children?: ReactNode;
}

function ToolbarButton({
  buttonName, width = 'w-10', onButtonClick, children = null,
}: ToolbarButtonProps) {
  return (
    <button
      id={buttonName}
      type="button"
      className={`${width} h-full flex flex-col justify-center items-center bg-transparent hover:bg-black`}
      onClick={() => onButtonClick(buttonName)}
    >
      {children}
    </button>
  );
}

interface ToolbarProps {
  projectFolder?: string;
  projectName?: string;
}

function Toolbar({ projectFolder = '[Project Folder]', projectName = '[Project Name]' }: ToolbarProps) {
  const [activeButtonId, setActiveButtonId] = useState<string>('');
  const updateActiveButton = useCallback((newActiveButtonId: string) => {
    setButtonStyle(activeButtonId, false);
    setButtonStyle(newActiveButtonId, true);
    setActiveButtonId(newActiveButtonId);
  }, [activeButtonId]);
  const zoomLevel = useSelector(getZoomLevel);
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  useOnViewportChange({
    onChange: (viewport: Viewport) => store.dispatch(setZoomLevel(viewport.zoom)),
  });

  return (
    <div id="toolbar" className="w-full h-12 flex flex-row justify-center items-center bg-figmaGrey">
      {/* <a href="/" className="text-2xl font-logo text-stratusPurple p-1.5">stratus</a> */}
      <div className="inline-block h-full flex flex-row">
        <ToolbarButton
          buttonName="home"
          width="w-12"
          onButtonClick={(newActiveButtonId: string) => updateActiveButton(newActiveButtonId)}
        >
          <div className="w-full h-full flex flex-row justify-center items-center">
            <HomeIcon />
            <ChevronDownIcon />
          </div>
        </ToolbarButton>
        <ToolbarButton
          buttonName="fit_view"
          onButtonClick={(newActiveButtonId: string) => {
            updateActiveButton(newActiveButtonId);
            fitView()
          }}
        >
          <FitView />
        </ToolbarButton>
        <ToolbarButton
          buttonName="zoom_out"
          onButtonClick={(newActiveButtonId: string) => {
            updateActiveButton(newActiveButtonId);
            zoomOut()
          }}
        >
          <ZoomOut />
        </ToolbarButton>
        <div className="h-full w-16 flex flex-col justify-center items-center">
          {Math.round(zoomLevel * 100)}%
        </div>
        <ToolbarButton
          buttonName="zoom_in"
          onButtonClick={(newActiveButtonId: string) => {
            updateActiveButton(newActiveButtonId);
            zoomIn()
          }}
        >
          <ZoomIn />
        </ToolbarButton>
        <ToolbarButton
          buttonName="text_box"
          onButtonClick={(newActiveButtonId: string) => updateActiveButton(newActiveButtonId)}
        >
          <TextBoxIcon />
        </ToolbarButton>
      </div>
      <div className="flex-1" />
      <div className="inline-block h-full flex flex-row justify-center items-center">
        <a href="/" className="text-sm my-1 text-textWhite">{projectFolder}</a>
        <ForwardSlash />
        <a href="/" className="text-sm my-1 text-textWhite">{projectName}</a>
      </div>
      <div className="flex-1" />
      <div className="inline-block h-full flex flex-row justify-center items-center mr-2">
        <ToolbarButton
          buttonName="debug"
          onButtonClick={(newActiveButtonId: string) => updateActiveButton(newActiveButtonId)}
        >
          <ClockIcon />
        </ToolbarButton>
        <ToolbarButton
          buttonName="history"
          onButtonClick={(newActiveButtonId: string) => updateActiveButton(newActiveButtonId)}
        >
          <DebugIcon />
        </ToolbarButton>
        <button type="button" className="btn btn-sm bg-stratusPurple text-textWhite hover:bg-stratusPurpleActive mx-4">
          Publish
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
