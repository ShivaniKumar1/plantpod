1. Ensure you have python3. Any of the later python versions should do, but this was tested on 3.8.10

2. Install all of the requirements under mrcnn/requirements.txt . Make sure to get the specified versions: pip3 install -I PACKAGE_NAME==PACKAGE_VERSION

3. Download the weights file (.h5), available at https://data.csiro.au/collection/csiro:34323v4 or if that is down https://drive.google.com/file/d/1iyJiLnmw11NO9nRefeFPN_0-kZnqLkpw/view?usp=sharing
 
4. Run the segmenter script with 'sudo python3 segmenter.py --inputImage './plant-test.png' --weightsPath ./leafSegmenter0005.h5 --useCPU'


